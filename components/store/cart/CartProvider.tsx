"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addCartItem,
  clearCart,
  getCartCountFromSnapshot,
  getCartServerSnapshot,
  getCartSnapshot,
  removeFromCart,
  subscribeToCart,
  updateCartQuantity,
} from "@/lib/cart/store";
import type { CartItem } from "@/types/cart";

type AddToCartInput = {
  productId: string;
  quantity: number;
  variantId?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  isHydrated: boolean;
  addToCart: (input: AddToCartInput) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null,
  ) => void;
  removeFromCart: (productId: string, variantId?: string | null) => void;
  clearCart: () => void;
  setCartCount: (count: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const addToCart = useCallback(({ productId, quantity, variantId }: AddToCartInput) => {
    if (quantity < 1) {
      return;
    }

    addCartItem({
      productId,
      quantity,
      variantId: variantId ?? null,
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string | null) => {
      updateCartQuantity(productId, quantity, variantId);
    },
    [],
  );

  const removeFromCartItem = useCallback(
    (productId: string, variantId?: string | null) => {
      removeFromCart(productId, variantId);
    },
    [],
  );

  const clearCartItems = useCallback(() => {
    clearCart();
  }, []);

  const setCartCount = useCallback((count: number) => {
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount === 0) {
      clearCart();
    }
  }, []);

  const cartCount = useMemo(
    () => getCartCountFromSnapshot(items),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      isHydrated: true,
      addToCart,
      updateQuantity,
      removeFromCart: removeFromCartItem,
      clearCart: clearCartItems,
      setCartCount,
    }),
    [
      addToCart,
      cartCount,
      clearCartItems,
      items,
      removeFromCartItem,
      setCartCount,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
