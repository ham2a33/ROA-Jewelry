"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import {
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_ERROR,
  validateImageUploadFile,
} from "@/lib/media/constants";
import {
  createMediaRecord,
  deleteMediaRecord,
} from "@/server/services/media";
import {
  formatMediaUsage,
  getMediaUsage,
} from "@/server/queries/admin/media";

type ActionResult =
  | { success: true; id?: string; url?: string }
  | { success: false; message: string };

export async function uploadAdminMedia(formData: FormData): Promise<ActionResult> {
  const user = await requirePermission("media.manage");
  assertPermission(user, "media.manage");

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, message: "Файл не выбран." };
  }

  const validationError = validateImageUploadFile(file);
  if (validationError) {
    return { success: false, message: validationError };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false, message: MAX_IMAGE_SIZE_ERROR };
  }

  const alt = String(formData.get("alt") ?? "");
  const folder = String(formData.get("folder") ?? "admin");

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await createMediaRecord({
      filename: file.name,
      mimeType: file.type,
      buffer,
      alt: alt || undefined,
      folder,
    });

    revalidatePath(siteConfig.routes.admin.media);
    return { success: true, id: media.id, url: media.url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить файл.";
    return { success: false, message };
  }
}

export async function deleteAdminMedia(mediaId: string): Promise<ActionResult> {
  const user = await requirePermission("media.manage");
  assertPermission(user, "media.manage");

  const usage = await getMediaUsage(mediaId);
  const usageLines = formatMediaUsage(usage);

  if (usageLines.length > 0) {
    return {
      success: false,
      message: `Нельзя удалить. Изображение используется:\n- ${usageLines.join("\n- ")}`,
    };
  }

  try {
    await deleteMediaRecord(mediaId);
    revalidatePath(siteConfig.routes.admin.media);
    return { success: true };
  } catch {
    return { success: false, message: "Не удалось удалить файл." };
  }
}

export async function copyMediaUrl(mediaId: string): Promise<ActionResult & { url?: string }> {
  await requirePermission("media.manage");
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { url: true },
  });
  if (!media) {
    return { success: false, message: "Файл не найден." };
  }
  return { success: true, url: media.url };
}
