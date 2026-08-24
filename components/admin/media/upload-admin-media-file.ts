import { uploadAdminMedia } from "@/server/actions/admin/media";
import {
  MEDIA_UPLOAD_ACCEPT,
  validateImageUploadFile,
} from "@/lib/media/constants";
import type { AdminMediaItem } from "@/types/admin-media";

export { MEDIA_UPLOAD_ACCEPT };

export type UploadAdminMediaFileResult =
  | { success: true; item: AdminMediaItem }
  | { success: false; message: string };

export async function uploadAdminMediaFile(
  file: File,
): Promise<UploadAdminMediaFileResult> {
  const validationError = validateImageUploadFile(file);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", "admin");

  const result = await uploadAdminMedia(formData);
  if (!result.success) {
    return {
      success: false,
      message: result.message ?? "Не удалось загрузить изображение.",
    };
  }
  if (!result.id || !result.url) {
    return {
      success: false,
      message: "Не удалось загрузить изображение.",
    };
  }

  return {
    success: true,
    item: {
      id: result.id,
      url: result.url,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      alt: null,
    },
  };
}

export function toAdminMediaItemFromUpload(
  file: File,
  id: string,
  url: string,
  alt: string | null = null,
): AdminMediaItem {
  return {
    id,
    url,
    filename: file.name,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    alt,
  };
}
