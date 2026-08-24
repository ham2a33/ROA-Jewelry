import "server-only";

import { prisma } from "@/lib/db";
import { mapCartProduct } from "@/server/queries/cart-mappers";
import type { CartProductData } from "@/types/cart";

export const cartProductSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  material: true,
  isActive: true,
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
      price: true,
      stock: true,
      isActive: true,
    },
  },
} as const;

export async function getCartProducts(
  productIds: string[],
): Promise<CartProductData[]> {
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
      select: cartProductSelect,
    });

    return products.map(mapCartProduct);
  } catch (error) {
    console.error("[getCartProducts]", error);
    throw error;
  }
}
