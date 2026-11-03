import {
  createPublicMediaResponse,
  readPublicMedia,
} from "@/lib/media/public-file";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

async function serve(request: Request, context: RouteContext): Promise<Response> {
  const { path: pathSegments } = await context.params;
  const media = await readPublicMedia(env.MEDIA_UPLOAD_DIR, pathSegments);
  return createPublicMediaResponse(request.method as "GET" | "HEAD", media);
}

export async function GET(request: Request, context: RouteContext) {
  return serve(request, context);
}

export async function HEAD(request: Request, context: RouteContext) {
  return serve(request, context);
}
