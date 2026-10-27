import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  MediaStorageAdapter,
  StoredObject,
  UploadObjectInput,
} from "./types";

function extensionFor(mimeType: string): string {
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

  private resolveWithinUploadDir(storageKey: string): string {
    const root = path.resolve(this.uploadDir);
    const destination = path.resolve(root, storageKey);
    if (destination !== root && !destination.startsWith(`${root}${path.sep}`)) {
      throw new Error("Invalid media storage key.");
    }
    return destination;
  }

  async upload(input: UploadObjectInput): Promise<StoredObject> {
    const folder =
      input.folder
        ?.split(/[\\/]/)
        .filter((segment) => /^[a-zA-Z0-9_-]+$/.test(segment))
        .join("/") || "general";
    const filename = `${randomUUID()}${extensionFor(input.mimeType)}`;
    const storageKey = `${folder}/${filename}`;
    const destination = this.resolveWithinUploadDir(storageKey);

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, input.buffer);

    return {
      storageKey,
      url: `/uploads/${storageKey}`,
      provider: this.provider,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const destination = this.resolveWithinUploadDir(storageKey);

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
