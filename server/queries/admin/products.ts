import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import type { Prisma } from "@/generated/prisma/client";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export type AdminProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "active" | "inactive";
  stock?: "in" | "out" | "low";
  featured?: "true" | "false";
  bestseller?: "true" | "false";
};

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  updatedAt: Date;
  categoryName: string;
  imageUrl: string | null;
};

export async function getAdminProducts(query: AdminProductsQuery) {
  await requireRuntimeAccess();
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? DEFAULT_ADMIN_PAGE_SIZE;
  const where: Prisma.ProductWhereInput = {};

  if (query.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.status === "active") {
    where.isActive = true;
  } else if (query.status === "inactive") {
    where.isActive = false;
  }

  if (query.stock === "out") {
    where.stock = 0;
  } else if (query.stock === "in") {
    where.stock = { gt: 0 };
  } else if (query.stock === "low") {
    where.stock = { gt: 0, lte: 5 };
  }

  if (query.featured === "true") {
    where.isFeatured = true;
  } else if (query.featured === "false") {
    where.isFeatured = false;
  }

  if (query.bestseller === "true") {
    where.isBestseller = true;
  } else if (query.bestseller === "false") {
    where.isBestseller = false;
  }

  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        stock: true,
        isActive: true,
        isFeatured: true,
        isBestseller: true,
        updatedAt: true,
        category: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { media: { select: { url: true } } },
        },
      },
    }),
  ]);

  return {
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      price: Number(row.price),
      stock: row.stock,
      isActive: row.isActive,
      isFeatured: row.isFeatured,
      isBestseller: row.isBestseller,
      updatedAt: row.updatedAt,
      categoryName: row.category.name,
      imageUrl: row.images[0]?.media.url ?? null,
    })) satisfies AdminProductListItem[],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminProductById(id: string) {
  await requireRuntimeAccess();
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { media: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        include: { image: true },
      },
      _count: { select: { orderItems: true } },
    },
  });
}

export async function getAdminCategoriesForSelect() {
  await requireRuntimeAccess();
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
}
