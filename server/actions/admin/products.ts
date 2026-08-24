"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import {
  productInputSchema,
  productVariantInputSchema,
} from "@/lib/validations/schemas";
import { z } from "zod";

type ActionResult =
  | { success: true; id?: string }
  | { success: false; message: string };

function revalidateProductPaths(slug?: string) {
  revalidatePath(siteConfig.routes.admin.products);
  revalidatePath(siteConfig.routes.catalog);
  if (slug) {
    revalidatePath(siteConfig.routes.product(slug));
  }
}

export async function createProduct(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        price: parsed.data.price,
        compareAtPrice: parsed.data.compareAtPrice ?? null,
        weightGrams: parsed.data.weightGrams ?? null,
      },
    });
    revalidateProductPaths(product.slug);
    return { success: true, id: product.id };
  } catch {
    return { success: false, message: "Не удалось создать товар." };
  }
}

export async function updateProduct(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const schema = productInputSchema.extend({
    id: z.string().min(1),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  const { id, ...data } = parsed.data;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        compareAtPrice: data.compareAtPrice ?? null,
        weightGrams: data.weightGrams ?? null,
      },
    });
    revalidateProductPaths(product.slug);
    return { success: true, id: product.id };
  } catch {
    return { success: false, message: "Не удалось обновить товар." };
  }
}

export async function deactivateProduct(id: string): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!product) {
    return { success: false, message: "Товар не найден." };
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidateProductPaths(product.slug);
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });

  if (!product) {
    return { success: false, message: "Товар не найден." };
  }

  if (product._count.orderItems > 0) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    revalidateProductPaths(product.slug);
    return {
      success: false,
      message: "Товар используется в заказах и был деактивирован вместо удаления.",
    };
  }

  await prisma.product.delete({ where: { id } });
  revalidateProductPaths(product.slug);
  return { success: true };
}

const productImagesSchema = z.object({
  productId: z.string().min(1),
  images: z.array(
    z.object({
      mediaId: z.string().min(1),
      alt: z.string().optional(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    }),
  ),
});

export async function syncProductImages(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const parsed = productImagesSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Некорректные изображения." };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { slug: true },
  });
  if (!product) {
    return { success: false, message: "Товар не найден." };
  }

  const mediaIds = [...new Set(parsed.data.images.map((image) => image.mediaId))];
  if (mediaIds.length > 0) {
    const existingCount = await prisma.media.count({
      where: { id: { in: mediaIds } },
    });
    if (existingCount !== mediaIds.length) {
      return { success: false, message: "Одно или несколько изображений не найдены." };
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({
      where: { productId: parsed.data.productId },
    });

    if (parsed.data.images.length > 0) {
      await tx.productImage.createMany({
        data: parsed.data.images.map((image) => ({
          productId: parsed.data.productId,
          mediaId: image.mediaId,
          alt: image.alt,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder,
        })),
      });
    }
  });

  revalidateProductPaths(product.slug);
  return { success: true };
}

const variantSchema = productVariantInputSchema.extend({
  id: z.string().optional(),
  productId: z.string().min(1),
});

export async function upsertProductVariant(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные варианта." };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { slug: true },
  });
  if (!product) {
    return { success: false, message: "Товар не найден." };
  }

  const { id, productId, ...data } = parsed.data;

  if (id) {
    await prisma.productVariant.update({
      where: { id },
      data: {
        ...data,
        price: data.price ?? null,
        imageId: data.imageId ?? null,
      },
    });
  } else {
    await prisma.productVariant.create({
      data: {
        productId,
        ...data,
        price: data.price ?? null,
        imageId: data.imageId ?? null,
      },
    });
  }

  revalidateProductPaths(product.slug);
  return { success: true };
}

export async function deleteProductVariant(variantId: string): Promise<ActionResult> {
  const user = await requirePermission("products.manage");
  assertPermission(user, "products.manage");

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: { select: { slug: true } } },
  });
  if (!variant) {
    return { success: false, message: "Вариант не найден." };
  }

  const orderCount = await prisma.orderItem.count({
    where: { variantId },
  });

  if (orderCount > 0) {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive: false },
    });
  } else {
    await prisma.productVariant.delete({ where: { id: variantId } });
  }

  revalidateProductPaths(variant.product.slug);
  return { success: true };
}
