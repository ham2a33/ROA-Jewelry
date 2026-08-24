import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { mapHomepageCategory } from "@/server/queries/mappers";
import {
  mapProductCard,
  productCardSelect,
  type ProductCardRecord,
} from "@/server/queries/product-mappers";
import type {
  CatalogCategory,
  CatalogResult,
  CatalogSearchParams,
  CatalogSort,
} from "@/types/catalog";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: {
    select: {
      id: true,
      url: true,
      alt: true,
      width: true,
      height: true,
      mimeType: true,
    },
  },
} as const;

function buildOrderBy(sort: CatalogSort): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "name":
      return [{ name: "asc" }];
    case "popular":
    default:
      return [{ isBestseller: "desc" }, { createdAt: "desc" }];
  }
}

async function resolveCategorySlug(
  slug: string | undefined,
): Promise<string | undefined> {
  if (!slug) {
    return undefined;
  }

  const category = await prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: { slug: true },
  });

  return category?.slug;
}

function buildWhereClause(
  params: CatalogSearchParams,
  categorySlug: string | undefined,
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
      isActive: true,
    };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { shortDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {
      ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
      ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
    };
  }

  if (params.stock === "in") {
    where.stock = { gt: 0 };
  }

  return where;
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: categorySelect,
    });

    return categories.map(mapHomepageCategory);
  } catch (error) {
    console.error("[getCatalogCategories]", error);
    return [];
  }
}

export async function getCatalogProducts(
  params: CatalogSearchParams,
): Promise<CatalogResult> {
  const emptyResult = (page = params.page): CatalogResult => ({
    products: [],
    total: 0,
    page,
    limit: params.limit,
    totalPages: 0,
  });

  try {
    const categorySlug = await resolveCategorySlug(params.category);
    const where = buildWhereClause(params, categorySlug);
    const orderBy = buildOrderBy(params.sort);

    const total = await prisma.product.count({ where });
    const totalPages = total === 0 ? 0 : Math.ceil(total / params.limit);
    const page =
      totalPages === 0
        ? 1
        : Math.min(Math.max(params.page, 1), totalPages);
    const skip = (page - 1) * params.limit;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: params.limit,
      select: productCardSelect,
    });

    return {
      products: products.map((product) =>
        mapProductCard(product as ProductCardRecord),
      ),
      total,
      page,
      limit: params.limit,
      totalPages,
    };
  } catch (error) {
    console.error("[getCatalogProducts]", error);
    return emptyResult(1);
  }
}
