import {
  MEDIA_UPLOAD_ACCEPT,
  validateImageUploadFile,
} from "@/lib/media/constants";
import { formatServerActionClientError } from "@/lib/server-actions/client-error";
import type { AdminMediaItem } from "@/types/admin-media";

export { MEDIA_UPLOAD_ACCEPT };

export type UploadAdminMediaFileResult =
  | { success: true; item: AdminMediaItem }
  | { success: false; message: string };

const ADMIN_MEDIA_UPLOAD_PATH = "/api/admin/media/upload";

type UploadApiResponse =
  | { success: true; id: string; url: string }
  | { success: false; message?: string };

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

  try {
    const response = await fetch(ADMIN_MEDIA_UPLOAD_PATH, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    let payload: UploadApiResponse | null = null;
    try {
      payload = (await response.json()) as UploadApiResponse;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      const message =
        payload && !payload.success && payload.message
          ? payload.message
          : formatServerActionClientError(
              new Error(
                `Upload failed with status ${response.status}: ${response.statusText}`,
              ),
            );
      return { success: false, message };
    }

    if (!payload.id || !payload.url) {
      return {
        success: false,
        message: "Не удалось загрузить изображение.",
      };
    }

    return {
      success: true,
      item: {
        id: payload.id,
        url: payload.url,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        alt: null,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatServerActionClientError(error),
    };
  }
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
