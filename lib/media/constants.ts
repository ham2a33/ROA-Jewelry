export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export const MAX_IMAGE_SIZE_MB = 20;

export const MAX_IMAGE_SIZE_LABEL = `${MAX_IMAGE_SIZE_MB} MB`;

export const MAX_IMAGE_SIZE_ERROR = `Файл слишком большой. Максимальный размер — ${MAX_IMAGE_SIZE_LABEL}.`;

export const MEDIA_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif";

export const MEDIA_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MEDIA_UPLOAD_HINT = `JPEG, PNG, WebP, AVIF. Максимальный размер: ${MAX_IMAGE_SIZE_LABEL}.`;

/** Server Action body limit — slightly above file limit for multipart overhead. */
export const SERVER_ACTION_UPLOAD_BODY_SIZE_LIMIT = "22mb";

export function validateImageUploadFile(file: File): string | null {
  if (
    !MEDIA_UPLOAD_MIME_TYPES.includes(
      file.type as (typeof MEDIA_UPLOAD_MIME_TYPES)[number],
    )
  ) {
    return "Неподдерживаемый формат. Разрешены JPEG, PNG, WebP и AVIF.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return MAX_IMAGE_SIZE_ERROR;
  }

  return null;
}
