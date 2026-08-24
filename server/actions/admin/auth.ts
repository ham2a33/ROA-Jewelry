"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  clearSessionCookie,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { siteConfig } from "@/lib/config/site-config";
import {
  getFirstZodErrorMessage,
  mapZodFieldErrors,
} from "@/lib/validations/errors";
import {
  adminLoginSchema,
  bootstrapAdminSchema,
} from "@/lib/validations/schemas";

type AuthField = "name" | "email" | "password";

type AuthResult =
  | { success: true }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<AuthField, string>>;
    };

export async function loginAdmin(input: unknown): Promise<AuthResult> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Неверный email или пароль.",
      fieldErrors: mapZodFieldErrors<AuthField>(parsed.error),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return { success: false, message: "Неверный email или пароль." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { success: false, message: "Неверный email или пароль." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await setSessionCookie({ userId: user.id, role: user.role });
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await clearSessionCookie();
  redirect(siteConfig.routes.admin.login);
}

export async function bootstrapFirstAdmin(input: unknown): Promise<AuthResult> {
  const count = await prisma.user.count();
  if (count > 0) {
    return { success: false, message: "Администратор уже создан." };
  }

  const parsed = bootstrapAdminSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: getFirstZodErrorMessage(parsed.error),
      fieldErrors: mapZodFieldErrors<AuthField>(parsed.error),
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Пользователь с таким email уже существует.",
      fieldErrors: { email: "Пользователь с таким email уже существует." },
    };
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        name: parsed.data.name.trim(),
        role: "ADMIN",
      },
    });

    await setSessionCookie({ userId: user.id, role: user.role });
    return { success: true };
  } catch (error) {
    console.error("[bootstrapFirstAdmin]", error);

    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        success: false,
        message: "Пользователь с таким email уже существует.",
        fieldErrors: { email: "Пользователь с таким email уже существует." },
      };
    }

    return {
      success: false,
      message: "Не удалось создать администратора. Попробуйте ещё раз.",
    };
  }
}

export async function updateProfile(input: unknown): Promise<AuthResult> {
  const { requireAuth } = await import("@/lib/auth/guards");
  const user = await requireAuth();

  const schema = adminLoginSchema.pick({ email: true }).extend({
    name: z.string().trim().min(1, "Введите имя"),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: getFirstZodErrorMessage(parsed.error),
      fieldErrors: mapZodFieldErrors<AuthField>(parsed.error),
    };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    return { success: false, message: "Пользователь не найден." };
  }

  if (parsed.data.newPassword) {
    if (!parsed.data.currentPassword) {
      return { success: false, message: "Введите текущий пароль." };
    }
    const valid = await verifyPassword(
      parsed.data.currentPassword,
      dbUser.passwordHash,
    );
    if (!valid) {
      return { success: false, message: "Неверный текущий пароль." };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      ...(parsed.data.newPassword
        ? { passwordHash: await hashPassword(parsed.data.newPassword) }
        : {}),
    },
  });

  revalidatePath(siteConfig.routes.admin.profile);
  return { success: true };
}
