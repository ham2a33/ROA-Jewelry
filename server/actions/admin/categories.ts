"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { categoryInputSchema } from "@/lib/validations/schemas";
import { z } from "zod";

type ActionResult =
  | { success: true; id?: string }
  | { success: false; message: string };

function revalidateCategoryPaths() {
  revalidatePath(siteConfig.routes.admin.categories);
  revalidatePath(siteConfig.routes.catalog);
  revalidatePath(siteConfig.routes.home);
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("categories.manage");
  assertPermission(user, "categories.manage");

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  if (parsed.data.imageId) {
    const image = await prisma.media.findUnique({
      where: { id: parsed.data.imageId },
      select: { id: true },
    });
    if (!image) {
      return { success: false, message: "Изображение не найдено." };
    }
  }

  try {
    const category = await prisma.category.create({ data: parsed.data });
    revalidateCategoryPaths();
    return { success: true, id: category.id };
  } catch {
    return { success: false, message: "Не удалось создать категорию." };
  }
}

export async function updateCategory(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("categories.manage");
  assertPermission(user, "categories.manage");

  const schema = categoryInputSchema.extend({ id: z.string().min(1) });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  const { id, ...data } = parsed.data;

  if (data.imageId) {
    const image = await prisma.media.findUnique({
      where: { id: data.imageId },
      select: { id: true },
    });
    if (!image) {
      return { success: false, message: "Изображение не найдено." };
    }
  }

  try {
    await prisma.category.update({ where: { id }, data });
    revalidateCategoryPaths();
    return { success: true, id };
  } catch {
    return { success: false, message: "Не удалось обновить категорию." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await requirePermission("categories.manage");
  assertPermission(user, "categories.manage");

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return { success: false, message: "Категория не найдена." };
  }

  if (category._count.products > 0) {
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
    revalidateCategoryPaths();
    return {
      success: false,
      message: "Категория содержит товары и была деактивирована.",
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidateCategoryPaths();
  return { success: true };
}
