import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  MediaStorageAdapter,
  StoredObject,
  UploadObjectInput,
} from "./types";

function extensionFor(filename: string, mimeType: string): string {
  const fromName = path.extname(filename).toLowerCase();
  if (fromName) {
    return fromName;
  }

  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    default:
      return "";
  }
}

export class LocalMediaStorage implements MediaStorageAdapter {
  readonly provider = "LOCAL" as const;

  constructor(private readonly uploadDir: string) {}

  async upload(input: UploadObjectInput): Promise<StoredObject> {
    const folder = input.folder?.replace(/^\/+|\/+$/g, "") || "general";
    const filename = `${randomUUID()}${extensionFor(input.filename, input.mimeType)}`;
    const storageKey = `${folder}/${filename}`;
    const destination = path.join(this.uploadDir, storageKey);

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, input.buffer);

    return {
      storageKey,
      url: `/uploads/${storageKey}`,
      provider: this.provider,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const destination = path.join(this.uploadDir, storageKey);

    try {
      await unlink(destination);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") {
        throw error;
      }
    }
  }

  getPublicUrl(storageKey: string): string {
    return `/uploads/${storageKey}`;
  }
}
