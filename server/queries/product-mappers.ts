import "server-only";

import type { MediaRef } from "@/lib/media/types";
import type { ProductCardData } from "@/types/product";
import { toMediaRef } from "@/server/queries/mappers";

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

export const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  isNew: true,
  isBestseller: true,
  category: {
    select: {
      name: true,
    },
  },
  images: {
    select: {
      alt: true,
      isPrimary: true,
      sortOrder: true,
      media: {
        select: {
          id: true,
          url: true,
          alt: true,
          width: true,
          height: true,
          mimeType: true,
        },
      },
    },
  },
};

export type ProductCardRecord = {
  id: string;
  name: string;
  slug: string;
  price: { toString(): string };
  compareAtPrice: { toString(): string } | null;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  category: { name: string };
  images: ProductImageRecord[];
};

function sortProductImages(images: ProductImageRecord[]): ProductImageRecord[] {
  return [...images].sort((left, right) => {
    if (left.isPrimary !== right.isPrimary) {
      return left.isPrimary ? -1 : 1;
    }

    return left.sortOrder - right.sortOrder;
  });
}

function pickPrimaryImage(images: ProductImageRecord[]): MediaRef | null {
  const sorted = sortProductImages(images);
  const primary = sorted[0];

  if (!primary) {
    return null;
  }

  const mediaRef = toMediaRef(primary.media);
  if (!mediaRef) {
    return null;
  }

  const alt = primary.alt?.trim();
  if (alt) {
    return { ...mediaRef, alt };
  }

  return mediaRef;
}

export function mapProductCard(product: ProductCardRecord): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? null,
    stock: product.stock,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    image: pickPrimaryImage(product.images),
    categoryName: product.category.name,
  };
}
