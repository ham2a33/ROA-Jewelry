import "server-only";

import { prisma } from "@/lib/db";
import { mapProductPage } from "@/server/queries/product-page-mappers";
import type { ProductPageData } from "@/types/product-page";

const mediaSelect = {
  id: true,
  url: true,
  alt: true,
  width: true,
  height: true,
  mimeType: true,
} as const;

export const productPageSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  shortDescription: true,
  price: true,
  compareAtPrice: true,
  sku: true,
  stock: true,
  material: true,
  hallmark: true,
  weightGrams: true,
  gender: true,
  isNew: true,
  isBestseller: true,
  isFeatured: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    select: {
      id: true,
      alt: true,
      isPrimary: true,
      sortOrder: true,
      media: {
        select: mediaSelect,
      },
    },
  },
  variants: {
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      sortOrder: true,
      isActive: true,
      image: {
        select: mediaSelect,
      },
    },
  },
} as const;

export async function getProductBySlug(
  slug: string,
): Promise<ProductPageData | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: productPageSelect,
    });

    if (!product || !product.isActive) {
      return null;
    }

    return mapProductPage(product);
  } catch (error) {
    console.error("[getProductBySlug]", error);
    throw error;
  }
}
