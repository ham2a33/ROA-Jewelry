import type { MediaRef } from "@/lib/media/types";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  image: MediaRef | null;
  categoryName: string;
};

export type ProductCardBadge = "SALE" | "NEW" | "HIT";

export type ProductBadgeSource = {
  price: string;
  compareAtPrice: string | null;
  isNew: boolean;
  isBestseller: boolean;
};

export function resolveProductBadge(
  product: ProductBadgeSource,
): ProductCardBadge | null {
  const price = Number(product.price);
  const compareAt = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;

  if (compareAt !== null && compareAt > price) {
    return "SALE";
  }

  if (product.isNew) {
    return "NEW";
  }

  if (product.isBestseller) {
    return "HIT";
  }

  return null;
}
