"use server";

import { getCartProducts } from "@/server/queries/cart";
import type { CartProductData } from "@/types/cart";

export async function fetchCartProducts(
  productIds: string[],
): Promise<CartProductData[]> {
  return getCartProducts(productIds);
}
