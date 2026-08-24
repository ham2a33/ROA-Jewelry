import { StoreButton } from "@/components/ui/StoreButton";
import { formatPrice } from "@/lib/utils/format-price";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  className?: string;
};

export function CartSummary({
  subtotal,
  itemCount,
  className,
}: CartSummaryProps) {
  const hasItems = itemCount > 0;

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

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Товары</dt>
          <dd className="font-medium text-foreground">
            {hasItems ? formatPrice(subtotal) : formatPrice(0)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Доставка</dt>
          <dd className="text-right text-foreground/80">
            При оформлении
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-border/50 pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm font-medium text-foreground">
            Итого
          </span>
          <span className="font-serif text-xl tracking-[0.02em] text-foreground">
            {hasItems ? formatPrice(subtotal) : formatPrice(0)}
          </span>
        </div>
      </div>

      <StoreButton
        className="mt-6"
        disabled={!hasItems}
        fullWidth
        href={siteConfig.routes.checkout}
      >
        Оформить заказ
      </StoreButton>
    </aside>
  );
}
