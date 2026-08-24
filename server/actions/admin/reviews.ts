"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { reviewInputSchema } from "@/lib/validations/schemas";
import { z } from "zod";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

export async function updateReviewStatus(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("reviews.manage");
  assertPermission(user, "reviews.manage");

  const schema = z.object({
    id: z.string().min(1),
    isApproved: z.boolean(),
    isPublished: z.boolean(),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Некорректные данные." };
  }

  await prisma.review.update({
    where: { id: parsed.data.id },
    data: {
      isApproved: parsed.data.isApproved,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath(siteConfig.routes.admin.reviews);
  revalidatePath(siteConfig.routes.home);
  return { success: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const user = await requirePermission("reviews.manage");
  assertPermission(user, "reviews.manage");

  await prisma.review.delete({ where: { id } });
  revalidatePath(siteConfig.routes.admin.reviews);
  return { success: true };
}

export async function createReview(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("reviews.manage");
  assertPermission(user, "reviews.manage");

  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  await prisma.review.create({
    data: {
      ...parsed.data,
      isApproved: true,
      isPublished: true,
    },
  });

  revalidatePath(siteConfig.routes.admin.reviews);
  return { success: true };
}

const reviewImagesSchema = z.object({
  reviewId: z.string().min(1),
  images: z.array(
    z.object({
      mediaId: z.string().min(1),
      sortOrder: z.number().int().default(0),
    }),
  ),
});

export async function syncReviewImages(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("reviews.manage");
  assertPermission(user, "reviews.manage");

  const parsed = reviewImagesSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Некорректные изображения." };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: { id: true },
  });
  if (!review) {
    return { success: false, message: "Отзыв не найден." };
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
    await tx.reviewImage.deleteMany({
      where: { reviewId: parsed.data.reviewId },
    });

    if (parsed.data.images.length > 0) {
      await tx.reviewImage.createMany({
        data: parsed.data.images.map((image, index) => ({
          reviewId: parsed.data.reviewId,
          mediaId: image.mediaId,
          sortOrder: image.sortOrder ?? index,
        })),
      });
    }
  });

  revalidatePath(siteConfig.routes.admin.reviews);
  revalidatePath(siteConfig.routes.reviews);
  return { success: true };
}
