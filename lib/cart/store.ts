import type { CartItem } from "@/types/cart";
import { getCartCount, readCartItems, writeCartItems } from "@/lib/cart/storage";

type CartListener = () => void;

/** Stable empty snapshot for SSR and empty client state. */
export const EMPTY_CART: CartItem[] = [];

const listeners = new Set<CartListener>();

let snapshot: CartItem[] = EMPTY_CART;

function cartItemsEqual(a: CartItem[], b: CartItem[]): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item, index) => {
    const other = b[index];
    if (!other) {
      return false;
    }
    return (
      item.productId === other.productId &&
      item.quantity === other.quantity &&
      (item.variantId ?? null) === (other.variantId ?? null)
    );
  });
}

function cloneCartItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    variantId: item.variantId ?? null,
  }));
}

function normalizeCartItems(items: CartItem[]): CartItem[] {
  if (items.length === 0) {
    return EMPTY_CART;
  }
  return items;
}

function commitSnapshot(nextItems: CartItem[]): void {
  const normalized = normalizeCartItems(nextItems);

  if (cartItemsEqual(snapshot, normalized)) {
    return;
  }

  snapshot =
    normalized === EMPTY_CART ? EMPTY_CART : cloneCartItems(normalized);
}

function refreshSnapshotFromStorage(): void {
  commitSnapshot(readCartItems());
}

function emitCartChange(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): CartItem[] {
  refreshSnapshotFromStorage();
  return snapshot;
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function updateCartItems(nextItems: CartItem[]): void {
  const normalized = normalizeCartItems(nextItems);
  writeCartItems(
    normalized === EMPTY_CART ? [] : cloneCartItems(normalized),
  );
  const previous = snapshot;
  commitSnapshot(normalized);
  if (previous !== snapshot) {
    emitCartChange();
  }
}

export function addCartItem(input: CartItem): void {
  const items = getCartSnapshot();
  const variantKey = input.variantId ?? null;
  const existingIndex = items.findIndex(
    (item) =>
      item.productId === input.productId &&
      (item.variantId ?? null) === variantKey,
  );

  if (existingIndex === -1) {
    updateCartItems([
      ...items,
      {
        productId: input.productId,
        quantity: input.quantity,
        variantId: variantKey,
      },
    ]);
    return;
  }

  const nextItems = items.map((item, index) =>
    index === existingIndex
      ? { ...item, quantity: item.quantity + input.quantity }
      : item,
  );
  updateCartItems(nextItems);
}

export function clearCartItems(): void {
  updateCartItems(EMPTY_CART);
}

export function clearCart(): void {
  clearCartItems();
}

export function removeFromCart(
  productId: string,
  variantId?: string | null,
): void {
  const variantKey = variantId ?? null;
  const items = getCartSnapshot().filter(
    (item) =>
      !(
        item.productId === productId &&
        (item.variantId ?? null) === variantKey
      ),
  );
  updateCartItems(items);
}

export function updateCartQuantity(
  productId: string,
  quantity: number,
  variantId?: string | null,
): void {
  const variantKey = variantId ?? null;

  if (quantity < 1) {
    removeFromCart(productId, variantId);
    return;
  }

  const items = getCartSnapshot().map((item) =>
    item.productId === productId && (item.variantId ?? null) === variantKey
      ? { ...item, quantity: Math.floor(quantity) }
      : item,
  );

  updateCartItems(items);
}

export function getCartCountFromSnapshot(items: CartItem[]): number {
  return getCartCount(items);
}
