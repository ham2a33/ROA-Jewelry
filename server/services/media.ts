import "server-only";

import { prisma } from "@/lib/db";
import { getMediaStorage } from "@/lib/media/storage";
import type { MediaRecord, UploadObjectInput } from "@/lib/media/types";
import { siteConfig } from "@/lib/config/site-config";
import { MAX_IMAGE_SIZE_ERROR } from "@/lib/media/constants";

export type CreateMediaInput = UploadObjectInput & {
  alt?: string;
  width?: number;
  height?: number;
};

function assertAllowedImage(mimeType: string): void {
  if (
    !siteConfig.media.allowedImageMimeTypes.includes(
      mimeType as (typeof siteConfig.media.allowedImageMimeTypes)[number],
    )
  ) {
    throw new Error(`Unsupported media type: ${mimeType}`);
  }
}

export async function createMediaRecord(
  input: CreateMediaInput,
): Promise<MediaRecord> {
  if (input.buffer.byteLength > siteConfig.media.maxUploadBytes) {
    throw new Error(MAX_IMAGE_SIZE_ERROR);
  }

  assertAllowedImage(input.mimeType);

  const stored = await getMediaStorage().upload(input);

  return prisma.media.create({
    data: {
      url: stored.url,
      storageKey: stored.storageKey,
      filename: stored.storageKey.split("/").pop() ?? stored.storageKey,
      originalName: input.filename,
      alt: input.alt,
      mimeType: input.mimeType,
      size: input.buffer.byteLength,
      width: input.width,
      height: input.height,
      folder: input.folder,
      provider: stored.provider,
    },
  });
}

export async function deleteMediaRecord(id: string): Promise<void> {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return;
  }

  await getMediaStorage().delete(media.storageKey);
  await prisma.media.delete({ where: { id } });
}
