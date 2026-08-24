"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { siteConfig } from "@/lib/config/site-config";
import { z } from "zod";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

export async function createAdminUser(input: unknown): Promise<ActionResult> {
  await requireAdminRole();

  const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "MANAGER"]),
  });

  const parsed = userSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role,
      },
    });
    revalidatePath(siteConfig.routes.admin.admins);
    return { success: true };
  } catch {
    return { success: false, message: "Не удалось создать пользователя." };
  }
}

export async function updateAdminUser(input: unknown): Promise<ActionResult> {
  const currentUser = await requireAdminRole();

  const schema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["ADMIN", "MANAGER"]),
    isActive: z.boolean(),
    password: z.string().min(8).optional(),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  if (parsed.data.id === currentUser.id && !parsed.data.isActive) {
    return { success: false, message: "Нельзя деактивировать свой аккаунт." };
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      ...(parsed.data.password
        ? { passwordHash: await hashPassword(parsed.data.password) }
        : {}),
    },
  });

  revalidatePath(siteConfig.routes.admin.admins);
  return { success: true };
}
