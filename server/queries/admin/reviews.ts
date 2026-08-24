import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export async function getAdminReviews(query?: {
  page?: number;
  limit?: number;
  status?: "published" | "hidden" | "all";
}) {
  await requireRuntimeAccess();
  const page = Math.max(1, query?.page ?? 1);
  const limit = query?.limit ?? DEFAULT_ADMIN_PAGE_SIZE;

  const where =
    query?.status === "published"
      ? { isPublished: true }
      : query?.status === "hidden"
        ? { isPublished: false }
        : {};

  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        product: { select: { name: true, slug: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          include: { media: true },
        },
      },
    }),
  ]);

  return {
    items: rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminReviewById(id: string) {
  await requireRuntimeAccess();
  return prisma.review.findUnique({
    where: { id },
    include: {
      product: { select: { name: true, slug: true } },
      images: { include: { media: true } },
    },
  });
}
