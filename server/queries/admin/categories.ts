import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export async function getAdminCategories(query?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  await requireRuntimeAccess();
  const page = Math.max(1, query?.page ?? 1);
  const limit = query?.limit ?? DEFAULT_ADMIN_PAGE_SIZE;
  const where = query?.search?.trim()
    ? {
        OR: [
          { name: { contains: query.search.trim(), mode: "insensitive" as const } },
          { slug: { contains: query.search.trim(), mode: "insensitive" as const } },
        ],
      }
    : {};

  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take: limit,
      include: {
        image: { select: { url: true } },
        _count: { select: { products: true } },
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

export async function getAdminCategoryById(id: string) {
  await requireRuntimeAccess();
  return prisma.category.findUnique({
    where: { id },
    include: {
      image: true,
      _count: { select: { products: true } },
    },
  });
}
