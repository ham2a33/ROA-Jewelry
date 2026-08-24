export type StorageProvider = "LOCAL" | "CLOUDINARY" | "S3";

export type MediaKind = "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";

export type UploadObjectInput = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
};

export type StoredObject = {
  storageKey: string;
  url: string;
  provider: StorageProvider;
};

export type MediaRecord = {
  id: string;
  url: string;
  storageKey: string;
  filename: string;
  originalName: string;
  alt: string | null;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  kind: MediaKind;
  provider: StorageProvider;
  folder: string | null;
};

export type MediaRef = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

export interface MediaStorageAdapter {
  readonly provider: StorageProvider;
  upload(input: UploadObjectInput): Promise<StoredObject>;
  delete(storageKey: string): Promise<void>;
  getPublicUrl(storageKey: string): string;
}
