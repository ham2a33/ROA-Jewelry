import type { MediaRef } from "@/lib/media/types";

export type CartItem = {
  productId: string;
  quantity: number;
  variantId?: string | null;
};

export const CART_STORAGE_KEY = "roa-cart";

export type CartProductVariant = {
  id: string;
  name: string;
  price: string | null;
  stock: number;
  isActive: boolean;
};

export type CartProductData = {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  material: string | null;
  isActive: boolean;
  image: MediaRef | null;
  categoryName: string;
  variants: CartProductVariant[];
};

export type CartLineStatus = "available" | "out_of_stock" | "unavailable";

export type ResolvedCartLine = {
  key: string;
  cartItem: CartItem;
  product: CartProductData | null;
  variantName: string | null;
  currentPrice: string;
  compareAtPrice: string | null;
  availableStock: number;
  status: CartLineStatus;
};

export function getCartLineKey(item: CartItem): string {
  return `${item.productId}:${item.variantId ?? ""}`;
}

export function resolveCartLine(
  item: CartItem,
  products: CartProductData[],
): ResolvedCartLine {
  const product = products.find((entry) => entry.id === item.productId) ?? null;
  const variantKey = item.variantId ?? null;

  if (!product || !product.isActive) {
    return {
      key: getCartLineKey(item),
      cartItem: item,
      product,
      variantName: null,
      currentPrice: "0",
      compareAtPrice: null,
      availableStock: 0,
      status: "unavailable",
    };
  }

  const variant = variantKey
    ? product.variants.find((entry) => entry.id === variantKey) ?? null
    : null;

  if (variantKey && (!variant || !variant.isActive)) {
    return {
      key: getCartLineKey(item),
      cartItem: item,
      product,
      variantName: variant?.name ?? null,
      currentPrice: variant?.price ?? product.price,
      compareAtPrice: product.compareAtPrice,
      availableStock: 0,
      status: "unavailable",
    };
  }

  const availableStock = variant?.stock ?? product.stock;
  const currentPrice = variant?.price ?? product.price;

  return {
    key: getCartLineKey(item),
    cartItem: item,
    product,
    variantName: variant?.name ?? null,
    currentPrice,
    compareAtPrice: product.compareAtPrice,
    availableStock,
    status: availableStock > 0 ? "available" : "out_of_stock",
  };
}

export function calculateCartSubtotal(lines: ResolvedCartLine[]): number {
  return lines.reduce((total, line) => {
    if (line.status !== "available") {
      return total;
    }

    const price = Number(line.currentPrice);
    if (!Number.isFinite(price)) {
      return total;
    }

    return total + price * line.cartItem.quantity;
  }, 0);
}
