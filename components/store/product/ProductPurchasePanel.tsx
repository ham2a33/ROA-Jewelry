"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/store/cart/CartProvider";
import { FavoriteButton } from "@/components/store/product/FavoriteButton";
import { ProductQuantity } from "@/components/store/product/ProductQuantity";
import { ProductWhatsAppButton } from "@/components/store/product/ProductWhatsAppButton";
import { StoreButton } from "@/components/ui/StoreButton";
import { buildCategoryUrl } from "@/lib/catalog/url";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { ProductPageData, ProductPageVariant } from "@/types/product-page";

type ProductPurchasePanelProps = {
  product: ProductPageData;
  badge?: "SALE" | "NEW" | "HIT" | null;
};

const badgeLabels = {
  SALE: "Sale",
  NEW: "New",
  HIT: "Хит",
} as const;

function getInitialVariant(
  variants: ProductPageVariant[],
): ProductPageVariant | null {
  if (variants.length === 0) {
    return null;
  }

  return (
    variants.find((variant) => variant.stock > 0) ??
    variants[0] ??
    null
  );
}

export function ProductPurchasePanel({ product, badge }: ProductPurchasePanelProps) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    () => getInitialVariant(product.variants)?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      null,
    [product.variants, selectedVariantId],
  );

  const availableStock = selectedVariant?.stock ?? product.stock;
  const displayPrice = selectedVariant?.price ?? product.price;
  const compareAtPrice = product.compareAtPrice;
  const hasComparePrice =
    compareAtPrice !== null && Number(compareAtPrice) > Number(displayPrice);
  const isOutOfStock = availableStock <= 0;
  const hasVariants = product.variants.length > 0;
  const safeQuantity = isOutOfStock
    ? 1
    : Math.min(Math.max(quantity, 1), availableStock);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={buildCategoryUrl(product.category.slug)}
          >
            {product.category.name}
          </Link>
          {badge ? (
            <span className="rounded-full bg-muted px-2.5 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-foreground/70">
              {badgeLabels[badge]}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-none tracking-[0.02em] text-foreground">
            {formatPrice(displayPrice)}
          </span>
          {hasComparePrice ? (
            <span className="pb-0.5 font-sans text-base text-muted-foreground line-through">
              {formatPrice(compareAtPrice!)}
            </span>
          ) : null}
        </div>

        <p
          className={cn(
            "text-sm",
            isOutOfStock ? "text-muted-foreground" : "text-foreground/80",
          )}
        >
          {isOutOfStock ? "Нет в наличии" : "В наличии"}
        </p>

        {product.shortDescription ? (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      {hasVariants ? (
        <fieldset className="space-y-3">
          <legend className="font-sans text-xs font-medium tracking-[0.08em] text-muted-foreground">
            Вариант
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isSelected = variant.id === selectedVariantId;
              const isVariantOutOfStock = variant.stock <= 0;

              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex min-h-10 items-center border px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-40",
                    isSelected
                      ? "border-foreground/25 bg-foreground/[0.04] text-foreground"
                      : "border-border/70 bg-surface-elevated text-foreground hover:border-foreground/15",
                  )}
                  disabled={isVariantOutOfStock}
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setQuantity(1);
                  }}
                  type="button"
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="space-y-5 border-t border-border/50 pt-8">
        <ProductQuantity
          disabled={isOutOfStock}
          maxQuantity={availableStock}
          onChange={setQuantity}
          quantity={safeQuantity}
        />

        <StoreButton
          disabled={isOutOfStock || (hasVariants && !selectedVariant)}
          fullWidth
          onClick={() => {
            addToCart({
              productId: product.id,
              quantity: safeQuantity,
              variantId: selectedVariant?.id ?? null,
            });
            setAdded(true);
          }}
          type="button"
        >
          {added ? "Добавлено" : "В корзину"}
        </StoreButton>

        {added ? (
          <p aria-live="polite" className="text-center text-sm text-muted-foreground">
            Товар добавлен в корзину
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <FavoriteButton productId={product.id} productName={product.name} />
            <span className="text-sm text-foreground/80">В избранное</span>
          </div>
        </div>

        <ProductWhatsAppButton productName={product.name} />
      </div>
    </div>
  );
}
