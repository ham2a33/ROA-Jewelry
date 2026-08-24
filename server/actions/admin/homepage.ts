"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { homepageSectionInputSchema } from "@/lib/validations/schemas";
import { z } from "zod";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

function revalidateHomepage() {
  revalidatePath(siteConfig.routes.home);
  revalidatePath(siteConfig.routes.admin.homepage);
}

export async function updateHomepageSection(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("homepage.manage");
  assertPermission(user, "homepage.manage");

  const schema = homepageSectionInputSchema.extend({
    id: z.string().min(1),
  });
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

  if (data.mobileImageId) {
    const mobileImage = await prisma.media.findUnique({
      where: { id: data.mobileImageId },
      select: { id: true },
    });
    if (!mobileImage) {
      return { success: false, message: "Мобильное изображение не найдено." };
    }
  }

  await prisma.homepageSection.update({
    where: { id },
    data: {
      type: data.type,
      key: data.key,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
      imageId: data.imageId ?? null,
      mobileImageId: data.mobileImageId ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      ...(data.settings !== undefined
        ? { settings: data.settings as Prisma.InputJsonValue }
        : {}),
    },
  });

  revalidateHomepage();
  return { success: true };
}

export async function toggleProductFlag(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const schema = z.object({
    productId: z.string().min(1),
    field: z.enum(["isFeatured", "isBestseller", "isNew"]),
    value: z.boolean(),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Некорректные данные." };
  }

  const product = await prisma.product.update({
    where: { id: parsed.data.productId },
    data: { [parsed.data.field]: parsed.data.value },
    select: { slug: true },
  });

  revalidatePath(siteConfig.routes.home);
  revalidatePath(siteConfig.routes.catalog);
  revalidatePath(siteConfig.routes.admin.collections);
  revalidatePath(siteConfig.routes.product(product.slug));
  return { success: true };
}
