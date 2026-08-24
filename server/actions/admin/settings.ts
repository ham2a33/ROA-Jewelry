"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { siteSettingsInputSchema } from "@/lib/validations/schemas";
import { parseStoredWhatsAppNumber } from "@/lib/utils/whatsapp";
import { ensureSiteSettings } from "@/server/queries/admin/settings";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

function revalidateSettingsPaths() {
  revalidatePath(siteConfig.routes.home);
  revalidatePath(siteConfig.routes.catalog);
  revalidatePath(siteConfig.routes.checkout);
  revalidatePath(siteConfig.routes.about);
  revalidatePath(siteConfig.routes.delivery);
  revalidatePath(siteConfig.routes.contacts);
  revalidatePath(siteConfig.routes.reviews);
  for (const path of Object.values(siteConfig.routes.admin)) {
    if (typeof path === "string") {
      revalidatePath(path);
    }
  }
}

export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("settings.manage");
  assertPermission(user, "settings.manage");

  const parsed = siteSettingsInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Проверьте данные формы." };
  }

  await ensureSiteSettings();

  const mediaIds = [
    parsed.data.logoId,
    parsed.data.faviconId,
    parsed.data.defaultOgImageId,
  ].filter((id): id is string => Boolean(id));

  if (mediaIds.length > 0) {
    const existingCount = await prisma.media.count({
      where: { id: { in: mediaIds } },
    });
    if (existingCount !== mediaIds.length) {
      return { success: false, message: "Одно или несколько изображений не найдены." };
    }
  }

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      ...parsed.data,
      instagramUrl: parsed.data.instagramUrl || null,
      whatsappUrl: parsed.data.whatsappUrl
        ? parseStoredWhatsAppNumber(parsed.data.whatsappUrl)
        : null,
      telegramUrl: parsed.data.telegramUrl || null,
    },
  });

  revalidateSettingsPaths();
  return { success: true };
}

export async function updateGeneralSettings(input: unknown): Promise<ActionResult> {
  return updateSiteSettings(input);
}

export async function updateContactSettings(input: unknown): Promise<ActionResult> {
  return updateSiteSettings(input);
}

export async function updateSocialSettings(input: unknown): Promise<ActionResult> {
  return updateSiteSettings(input);
}

export async function updateSeoSettings(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("seo.manage");
  assertPermission(user, "seo.manage");
  return updateSiteSettings(input);
}
