"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Container } from "@/components/ui/Container";
import { CartItem } from "@/components/store/cart/CartItem";
import { CartSummary } from "@/components/store/cart/CartSummary";
import { StoreEmptyState } from "@/components/store/shared/StoreEmptyState";
import { StorePageHeader } from "@/components/store/shared/StorePageHeader";
import { useCart } from "@/components/store/cart/CartProvider";
import { getCartSnapshot, updateCartQuantity } from "@/lib/cart/store";
import { fetchCartProducts } from "@/server/actions/cart";
import { siteConfig } from "@/lib/config/site-config";
import {
  calculateCartSubtotal,
  resolveCartLine,
  type CartItem as CartItemType,
  type CartProductData,
} from "@/types/cart";

function CartItemsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          className="grid gap-5 border-b border-border/50 py-8 sm:grid-cols-[6.5rem_minmax(0,1fr)]"
          key={index}
        >
          <div className="aspect-[4/5] rounded-xl bg-muted" />
          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-11 w-32 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function syncQuantitiesWithStock(
  cartItems: CartItemType[],
  productData: CartProductData[],
): void {
  for (const item of cartItems) {
    const line = resolveCartLine(item, productData);
    if (
      line.status === "available" &&
      line.availableStock > 0 &&
      item.quantity > line.availableStock
    ) {
      updateCartQuantity(item.productId, line.availableStock, item.variantId);
    }
  }
}

export function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<CartProductData[]>([]);
  const [isPending, startTransition] = useTransition();

  const productIds = useMemo(
    () => [...new Set(items.map((item) => item.productId))],
    [items],
  );
  const productIdsKey = productIds.join(",");
  const loadedProductIdsKey = useMemo(
    () => products.map((product) => product.id).sort().join(","),
    [products],
  );
  const needsFetch =
    productIds.length > 0 && productIdsKey !== loadedProductIdsKey;

  useEffect(() => {
    if (!needsFetch) {
      return;
    }

    let cancelled = false;

    startTransition(() => {
      void fetchCartProducts(productIds)
        .then((nextProducts) => {
          if (cancelled) {
            return;
          }

          setProducts(nextProducts);
          syncQuantitiesWithStock(getCartSnapshot(), nextProducts);
        })
        .catch((error) => {
          console.error("[CartPage]", error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [needsFetch, productIds, productIdsKey]);

  const activeProducts = useMemo(
    () => (productIds.length === 0 ? [] : products),
    [productIds.length, products],
  );

  const lines = useMemo(
    () => items.map((item) => resolveCartLine(item, activeProducts)),
    [activeProducts, items],
  );

  const subtotal = useMemo(() => calculateCartSubtotal(lines), [lines]);
  const availableItemCount = lines.filter(
    (line) => line.status === "available",
  ).length;

  if (items.length === 0) {
    return (
      <Container as="div" className="py-8 sm:py-10 lg:py-14">
        <StorePageHeader title="Корзина" />
        <StoreEmptyState
          ctaHref={siteConfig.routes.catalog}
          ctaLabel="Перейти в каталог"
          description="Откройте каталог и найдите украшение, которое станет вашим."
          title="В корзине пока ничего нет"
        />
      </Container>
    );
  }

  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-14">
      <StorePageHeader title="Корзина" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
        <section aria-label="Товары в корзине">
          {needsFetch && isPending ? (
            <CartItemsSkeleton />
          ) : (
            lines.map((line) => (
              <CartItem
                key={line.key}
                line={line}
                onQuantityChange={(quantity) =>
                  updateQuantity(
                    line.cartItem.productId,
                    quantity,
                    line.cartItem.variantId,
                  )
                }
                onRemove={() =>
                  removeFromCart(
                    line.cartItem.productId,
                    line.cartItem.variantId,
                  )
                }
              />
            ))
          )}
        </section>

        <CartSummary itemCount={availableItemCount} subtotal={subtotal} />
      </div>
    </Container>
  );
}
