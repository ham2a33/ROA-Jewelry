"use server";

import {
  getFavoriteProducts,
  getMissingFavoriteIds,
  type FavoriteProductData,
} from "@/server/queries/favorites";

export async function fetchFavoriteProducts(
  productIds: string[],
): Promise<{
  products: FavoriteProductData[];
  missingIds: string[];
}> {
  const products = await getFavoriteProducts(productIds);
  const missingIds = getMissingFavoriteIds(productIds, products);

  return {
    products,
    missingIds,
  };
}
