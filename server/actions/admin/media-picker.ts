"use server";

import { requirePermission } from "@/lib/auth/guards";
import { getAdminMedia } from "@/server/queries/admin/media";
import type { AdminMediaItem } from "@/types/admin-media";

type FetchMediaPickerInput = {
  search?: string;
  page?: number;
};

export async function fetchMediaPickerItems(input: FetchMediaPickerInput = {}) {
  await requirePermission("media.manage");

  const result = await getAdminMedia({
    search: input.search,
    page: input.page ?? 1,
    limit: 24,
    kind: "IMAGE",
  });

  const items: AdminMediaItem[] = result.items.map((item) => ({
    id: item.id,
    url: item.url,
    filename: item.filename,
    originalName: item.originalName,
    mimeType: item.mimeType,
    size: item.size,
    alt: item.alt,
  }));

  return {
    items,
    page: result.page,
    totalPages: result.totalPages,
    total: result.total,
  };
}
