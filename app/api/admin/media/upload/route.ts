import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/api/require-admin-api-auth";
import { isSameOriginRequest } from "@/lib/api/origin";
import { siteConfig } from "@/lib/config/site-config";
import {
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_ERROR,
  validateImageUploadFile,
} from "@/lib/media/constants";
import { createMediaRecord } from "@/server/services/media";
import { validateImageBuffer } from "@/lib/media/image-validation";

export const runtime = "nodejs";

type UploadSuccessResponse = {
  success: true;
  id: string;
  url: string;
};

type UploadErrorResponse = {
  success: false;
  message: string;
};

export async function POST(
  request: Request,
): Promise<NextResponse<UploadSuccessResponse | UploadErrorResponse>> {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { success: false, message: "Недопустимый источник запроса." },
      { status: 403 },
    );
  }

  const auth = await requireAdminApiPermission("media.manage");
  if ("response" in auth) {
    return auth.response as NextResponse<UploadErrorResponse>;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Не удалось прочитать файл. Проверьте размер (до 20 MB) и попробуйте снова.",
      },
      { status: 413 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "Файл не выбран." },
      { status: 400 },
    );
  }

  const validationError = validateImageUploadFile(file);
  if (validationError) {
    return NextResponse.json(
      { success: false, message: validationError },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { success: false, message: MAX_IMAGE_SIZE_ERROR },
      { status: 413 },
    );
  }

  const alt = String(formData.get("alt") ?? "");
  const folder = String(formData.get("folder") ?? "admin");

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const signatureError = validateImageBuffer(buffer, file.type);
    if (signatureError) {
      return NextResponse.json(
        { success: false, message: signatureError },
        { status: 400 },
      );
    }

    const media = await createMediaRecord({
      filename: file.name,
      mimeType: file.type,
      buffer,
      alt: alt || undefined,
      folder,
    });

    revalidatePath(siteConfig.routes.admin.media);

    return NextResponse.json({
      success: true,
      id: media.id,
      url: media.url,
    });
  } catch (error) {
    console.error("[admin-media-upload] upload failed", {
      error: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { success: false, message: "Не удалось сохранить изображение." },
      { status: 500 },
    );
  }
}
