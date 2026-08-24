import type { MediaRef } from "./types";

export function resolveMediaUrl(
  media: Pick<MediaRef, "url"> | null | undefined,
): string | null {
  return media?.url ?? null;
}

export function toMediaRef(media: MediaRef | null | undefined): MediaRef | null {
  return media ?? null;
}

export type { MediaRef } from "./types";
export type {
  MediaKind,
  MediaRecord,
  MediaStorageAdapter,
  StoredObject,
  StorageProvider,
  UploadObjectInput,
} from "./types";
export { getMediaStorage } from "./storage";
