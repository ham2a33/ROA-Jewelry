import "server-only";

import { toMediaRef } from "@/server/queries/mappers";
import type { CartProductData } from "@/types/cart";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

type ProductImageRecord = {
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  media: MediaRecord;
};

function pickPrimaryImage(images: ProductImageRecord[]): CartProductData["image"] {
  const sorted = [...images].sort((left, right) => {
    if (left.isPrimary !== right.isPrimary) {
      return left.isPrimary ? -1 : 1;
    }

    return left.sortOrder - right.sortOrder;
  });

  const primary = sorted[0];
  if (!primary) {
    return null;
  }

  const mediaRef = toMediaRef(primary.media);
  if (!mediaRef) {
    return null;
  }

  const alt = primary.alt?.trim();
  return alt ? { ...mediaRef, alt } : mediaRef;
}

export function mapCartProduct(product: {
  id: string;
  name: string;
  slug: string;
  price: { toString(): string };
  compareAtPrice: { toString(): string } | null;
  stock: number;
  material: string | null;
  isActive: boolean;
  category: { name: string };
  images: ProductImageRecord[];
  variants: Array<{
    id: string;
    name: string;
    price: { toString(): string } | null;
    stock: number;
    isActive: boolean;
  }>;
}): CartProductData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? null,
    stock: product.stock,
    material: product.material?.trim() || null,
    isActive: product.isActive,
    image: pickPrimaryImage(product.images),
    categoryName: product.category.name,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price?.toString() ?? null,
      stock: variant.stock,
      isActive: variant.isActive,
    })),
  };
}
