import "server-only";

import { z } from "zod";

const storageProviderSchema = z.enum(["local", "cloudinary", "s3"]);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().optional().default(""),
  MEDIA_STORAGE_PROVIDER: storageProviderSchema.default("local"),
  MEDIA_UPLOAD_DIR: z.string().min(1).default("./public/uploads"),
  MEDIA_PUBLIC_BASE_URL: z.string().optional().default(""),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
  S3_BUCKET: z.string().optional().default(""),
  S3_REGION: z.string().optional().default(""),
  S3_ACCESS_KEY_ID: z.string().optional().default(""),
  S3_SECRET_ACCESS_KEY: z.string().optional().default(""),
  S3_ENDPOINT: z.string().optional().default(""),
  S3_PUBLIC_HOSTNAME: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;
export type StorageProviderName = z.infer<typeof storageProviderSchema>;

let cachedEnv: Env | undefined;

function readEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
}

/** Validates and returns env at runtime — safe to import during `next build`. */
export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = readEnv();
  }

  return cachedEnv;
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string | symbol) {
    if (typeof prop !== "string") {
      return undefined;
    }

    return getEnv()[prop as keyof Env];
  },
});
