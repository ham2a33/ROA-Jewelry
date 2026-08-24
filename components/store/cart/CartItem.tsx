"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { CartQuantity } from "@/components/store/cart/CartQuantity";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { ResolvedCartLine } from "@/types/cart";

type CartItemProps = {
  line: ResolvedCartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

function resolveImageAlt(line: ResolvedCartLine): string {
  const alt = line.product?.image?.alt?.trim();
  return alt && alt.length > 0 ? alt : line.product?.name ?? "Товар";
}

export function CartItem({ line, onQuantityChange, onRemove }: CartItemProps) {
  const product = line.product;
  const hasComparePrice =
    line.compareAtPrice !== null &&
    Number(line.compareAtPrice) > Number(line.currentPrice);
  const isInteractive = line.status === "available";

  return (
    <article className="grid gap-5 border-b border-border/50 py-8 first:pt-0 last:border-b-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-6">
      {product ? (
        <Link
          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={siteConfig.routes.product(product.slug)}
        >
          <CoverImageFrame className="aspect-[4/5] rounded-xl bg-muted sm:rounded-2xl">
            {product.image ? (
              <CoverImage
                alt={resolveImageAlt(line)}
                sizes="120px"
                src={product.image.url}
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
              />
            )}
          </CoverImageFrame>
        </Link>
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:rounded-2xl">
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
            Нет изображения
          </div>
        </div>
      )}

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {product ? (
              <Link
                className="font-sans text-base font-medium leading-snug text-foreground transition-colors duration-200 hover:text-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={siteConfig.routes.product(product.slug)}
              >
                {product.name}
              </Link>
            ) : (
              <p className="font-sans text-base font-medium text-foreground">
                Товар
              </p>
            )}

            {line.variantName ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {line.variantName}
              </p>
            ) : null}

            {product?.material ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {product.material}
              </p>
            ) : null}

            {line.status === "unavailable" ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Товар больше недоступен
              </p>
            ) : null}

            {line.status === "out_of_stock" ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Нет в наличии
              </p>
            ) : null}
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:justify-end">
              <span className="font-sans text-sm font-medium text-foreground">
                {formatPrice(line.currentPrice)}
              </span>
              {hasComparePrice ? (
                <span className="font-sans text-xs text-muted-foreground line-through">
                  {formatPrice(line.compareAtPrice!)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CartQuantity
            disabled={!isInteractive}
            maxQuantity={line.availableStock}
            onChange={onQuantityChange}
            quantity={line.cartItem.quantity}
          />

          <button
            aria-label={
              product
                ? `Удалить «${product.name}» из корзины`
                : "Удалить товар из корзины"
            }
            className={cn(
              "inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto",
            )}
            onClick={onRemove}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}
