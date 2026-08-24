"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { HOMEPAGE_PROMO_BANNER_SLOT } from "@/lib/homepage/image-slots";
import { idSchema } from "@/lib/validations/common";
import { ensureHomepagePromoBannerSection } from "@/server/queries/homepage-promo-banner";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

const updateHomepagePromoBannerImagesSchema = z.object({
  sectionId: idSchema,
  imageId: idSchema.optional().nullable(),
  mobileImageId: idSchema.optional().nullable(),
});

function revalidatePromoBanner() {
  revalidatePath(siteConfig.routes.home);
  revalidatePath(siteConfig.routes.admin.homepage);
}

async function assertMediaExists(mediaId: string, label: string) {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { id: true },
  });

  if (!media) {
    throw new Error(`${label} не найдено.`);
  }
}

export async function updateHomepagePromoBannerImages(
  input: unknown,
): Promise<ActionResult> {
  const user = await requirePermission("homepage.manage");
  assertPermission(user, "homepage.manage");

  const parsed = updateHomepagePromoBannerImagesSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  const section = await ensureHomepagePromoBannerSection();
  if (section.id !== parsed.data.sectionId) {
    return { success: false, message: "Некорректная секция баннера." };
  }

  try {
    if (parsed.data.imageId) {
      await assertMediaExists(parsed.data.imageId, "Изображение");
    }

    if (parsed.data.mobileImageId) {
      await assertMediaExists(parsed.data.mobileImageId, "Мобильное изображение");
    }

    await prisma.homepageSection.update({
      where: {
        id: section.id,
        key: HOMEPAGE_PROMO_BANNER_SLOT.key,
      },
      data: {
        imageId: parsed.data.imageId ?? null,
        mobileImageId: parsed.data.mobileImageId ?? null,
      },
    });

    revalidatePromoBanner();
    return { success: true };
  } catch (error) {
    console.error("[updateHomepagePromoBannerImages]", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Не удалось сохранить баннер.",
    };
  }
}
