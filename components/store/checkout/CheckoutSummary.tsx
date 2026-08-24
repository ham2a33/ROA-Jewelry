"use client";

import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { CheckoutOrderLine } from "@/types/checkout";

type CheckoutSummaryProps = {
  lines: CheckoutOrderLine[];
  subtotal: number;
  className?: string;
};

function resolveImageAlt(line: CheckoutOrderLine): string {
  const alt = line.image?.alt?.trim();
  return alt && alt.length > 0 ? alt : line.productName;
}

export function CheckoutSummary({
  lines,
  subtotal,
  className,
}: CheckoutSummaryProps) {
  return (
    <aside
      className={cn(
        "border-t border-border/50 pt-8 lg:sticky lg:top-28 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10",
        className,
      )}
    >
      <h2 className="font-serif text-xl tracking-[0.02em] text-foreground">
        Ваш заказ
      </h2>

      <ul className="mt-6 space-y-5">
        {lines.map((line) => (
          <li
            className="flex gap-4 border-b border-border/50 pb-5 last:border-b-0 last:pb-0"
            key={`${line.productId}:${line.variantId ?? ""}`}
          >
            <CoverImageFrame className="h-24 w-[4.5rem] shrink-0 rounded-xl bg-muted">
              {line.image ? (
                <CoverImage
                  alt={resolveImageAlt(line)}
                  sizes="72px"
                  src={line.image.url}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
                />
              )}
            </CoverImageFrame>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-foreground">
                {line.productName}
              </p>
              {line.variantName ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {line.variantName.includes(":")
                    ? line.variantName
                    : `Размер: ${line.variantName}`}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPrice(line.unitPrice)} × {line.quantity}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {formatPrice(line.lineTotal)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-4 border-t border-border/50 pt-6 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Товары</dt>
          <dd className="font-medium text-foreground">
            {formatPrice(subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Доставка</dt>
          <dd className="text-right text-foreground/80">Уточним с менеджером</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-border/50 pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm font-medium text-foreground">
            Итого
          </span>
          <span className="font-serif text-xl tracking-[0.02em] text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
    </aside>
  );
}
