import { realpath, stat, readFile } from "node:fs/promises";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export type PublicMediaResult = {
  body: Buffer;
  contentType: string;
  contentLength: number;
  cacheControl: string;
};

export function createPublicMediaResponse(
  method: "GET" | "HEAD",
  media: PublicMediaResult | null,
): Response {
  if (!media) return new Response("Not Found", { status: 404 });

  return new Response(method === "HEAD" ? null : new Uint8Array(media.body), {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Content-Length": String(media.contentLength),
      "Cache-Control": media.cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function readPublicMedia(
  uploadDir: string,
  pathSegments: string[],
): Promise<PublicMediaResult | null> {
  if (
    pathSegments.length < 2 ||
    pathSegments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes("/") ||
        segment.includes("\\") ||
        segment.includes("\0"),
    )
  ) {
    return null;
  }

  const relativePath = pathSegments.join(path.sep);
  const extension = path.extname(relativePath).toLowerCase();
  const contentType = MIME_TYPES[extension];
  if (!contentType) return null;

  try {
    const root = await realpath(uploadDir);
    const requestedPath = path.resolve(root, relativePath);
    if (!requestedPath.startsWith(`${root}${path.sep}`)) return null;

    const actualPath = await realpath(requestedPath);
    if (!actualPath.startsWith(`${root}${path.sep}`)) return null;
    const fileStat = await stat(actualPath);
    if (!fileStat.isFile()) return null;

    const filename = path.basename(actualPath);
    const immutableUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/i.test(filename);

    return {
      body: await readFile(actualPath),
      contentType,
      contentLength: fileStat.size,
      cacheControl: immutableUuid
        ? "public, max-age=31536000, immutable"
        : "public, max-age=300",
    };
  } catch {
    return null;
  }
}
