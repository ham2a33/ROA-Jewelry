import type { CartItem } from "@/types/cart";
import { CART_STORAGE_KEY } from "@/types/cart";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0 &&
    (item.variantId === undefined ||
      item.variantId === null ||
      typeof item.variantId === "string")
  );
}

export function readCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem).map((item) => ({
      productId: item.productId,
      quantity: Math.floor(item.quantity),
      variantId: item.variantId ?? null,
    }));
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
