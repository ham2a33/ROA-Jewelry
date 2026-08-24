import "server-only";

import { toMediaRef } from "@/server/queries/mappers";
import type { Gender } from "@/types/index";
import type {
  ProductPageData,
  ProductPageImage,
  ProductPageVariant,
} from "@/types/product-page";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

type ProductImageRecord = {
  id: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  media: MediaRecord;
};

type ProductVariantRecord = {
  id: string;
  name: string;
  sku: string;
  price: { toString(): string } | null;
  stock: number;
  sortOrder: number;
  isActive: boolean;
  image: MediaRecord | null;
};

function sortImages(images: ProductImageRecord[]): ProductPageImage[] {
  return [...images]
    .sort((left, right) => {
      if (left.isPrimary !== right.isPrimary) {
        return left.isPrimary ? -1 : 1;
      }

      return left.sortOrder - right.sortOrder;
    })
    .flatMap((image) => {
      const media = toMediaRef(image.media);
      if (!media) {
        return [];
      }

      return [
        {
          id: image.id,
          alt: image.alt,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder,
          media,
        },
      ];
    });
}

function mapVariant(variant: ProductVariantRecord): ProductPageVariant {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    price: variant.price?.toString() ?? null,
    stock: variant.stock,
    image: toMediaRef(variant.image),
    isActive: variant.isActive,
    sortOrder: variant.sortOrder,
  };
}

export function mapProductPage(product: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: { toString(): string };
  compareAtPrice: { toString(): string } | null;
  sku: string;
  stock: number;
  material: string | null;
  hallmark: string | null;
  weightGrams: { toString(): string } | null;
  gender: Gender;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImageRecord[];
  variants: ProductVariantRecord[];
}): ProductPageData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description?.trim() || null,
    shortDescription: product.shortDescription?.trim() || null,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? null,
    sku: product.sku,
    stock: product.stock,
    material: product.material?.trim() || null,
    hallmark: product.hallmark?.trim() || null,
    weightGrams: product.weightGrams?.toString() ?? null,
    gender: product.gender,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    images: sortImages(product.images),
    variants: product.variants
      .filter((variant) => variant.isActive)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(mapVariant),
  };
}
