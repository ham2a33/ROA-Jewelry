import "server-only";

import { prisma } from "@/lib/db";
import {
  mapProductCard,
  productCardSelect,
  type ProductCardRecord,
} from "@/server/queries/product-mappers";
import type { ProductCardData } from "@/types/product";

export type FavoriteProductData = ProductCardData & {
  isActive: boolean;
};

export async function getFavoriteProducts(
  productIds: string[],
): Promise<FavoriteProductData[]> {
  if (productIds.length === 0) {
    return [];
  }

  try {
    const uniqueIds = [...new Set(productIds)];
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
      select: {
        ...productCardSelect,
        isActive: true,
      },
    });

    const productMap = new Map(
      products.map((product) => [
        product.id,
        {
          ...mapProductCard(product as ProductCardRecord),
          isActive: product.isActive,
        },
      ]),
    );

    return productIds.flatMap((id) => {
      const product = productMap.get(id);
      return product ? [product] : [];
    });
  } catch (error) {
    console.error("[getFavoriteProducts]", error);
    throw error;
  }
}

export function getMissingFavoriteIds(
  productIds: string[],
  products: FavoriteProductData[],
): string[] {
  const foundIds = new Set(products.map((product) => product.id));
  return productIds.filter((id) => !foundIds.has(id));
}
