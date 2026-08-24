import "server-only";

import { prisma } from "@/lib/db";
import {
  mapProductCard,
  productCardSelect,
  type ProductCardRecord,
} from "@/server/queries/product-mappers";
import type { ProductCardData } from "@/types/product";

const RELATED_PRODUCTS_LIMIT = 4;

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        isActive: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { isBestseller: "desc" },
        { createdAt: "desc" },
      ],
      take: RELATED_PRODUCTS_LIMIT,
      select: productCardSelect,
    });

    return products.map((product) =>
      mapProductCard(product as ProductCardRecord),
    );
  } catch (error) {
    console.error("[getRelatedProducts]", error);
    return [];
  }
}
