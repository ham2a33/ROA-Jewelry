import "server-only";

import { env } from "@/lib/env";
import { LocalMediaStorage } from "./local-storage";
import type { MediaStorageAdapter, StorageProvider } from "./types";

class UnconfiguredMediaStorage implements MediaStorageAdapter {
  constructor(readonly provider: Exclude<StorageProvider, "LOCAL">) {}

  async upload(): Promise<never> {
    throw new Error(
      `${this.provider} media storage is not wired yet. Keep MEDIA_STORAGE_PROVIDER=local until that adapter is implemented.`,
    );
  }

  async delete(): Promise<never> {
    throw new Error(
      `${this.provider} media storage is not wired yet. Keep MEDIA_STORAGE_PROVIDER=local until that adapter is implemented.`,
    );
  }

  getPublicUrl(): never {
    throw new Error(
      `${this.provider} media storage is not wired yet. Keep MEDIA_STORAGE_PROVIDER=local until that adapter is implemented.`,
    );
  }
}

let cachedAdapter: MediaStorageAdapter | undefined;

export function getMediaStorage(): MediaStorageAdapter {
  if (cachedAdapter) {
    return cachedAdapter;
  }

  switch (env.MEDIA_STORAGE_PROVIDER) {
    case "local":
      cachedAdapter = new LocalMediaStorage(env.MEDIA_UPLOAD_DIR);
      return cachedAdapter;
    case "cloudinary":
      cachedAdapter = new UnconfiguredMediaStorage("CLOUDINARY");
      return cachedAdapter;
    case "s3":
      cachedAdapter = new UnconfiguredMediaStorage("S3");
      return cachedAdapter;
    default: {
      const provider: never = env.MEDIA_STORAGE_PROVIDER;
      throw new Error(`Unsupported media storage provider: ${provider}`);
    }
  }
}
