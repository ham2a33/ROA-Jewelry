import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { formatPrice } from "@/lib/utils/format-price";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";
import {
  resolveProductBadge,
  type ProductCardData,
} from "@/types/product";
import { FavoriteButton } from "@/components/store/product/FavoriteButton";

type ProductCardProps = {
  product: ProductCardData;
  className?: string;
};

const badgeLabels = {
  SALE: "Sale",
  NEW: "New",
  HIT: "Хит",
} as const;

function resolveImageAlt(product: ProductCardData): string {
  const alt = product.image?.alt?.trim();
  return alt && alt.length > 0 ? alt : product.name;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const href = siteConfig.routes.product(product.slug);
  const badge = resolveProductBadge(product);
  const isOutOfStock = product.stock === 0;
  const hasComparePrice =
    product.compareAtPrice !== null &&
    Number(product.compareAtPrice) > Number(product.price);

  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={href}
      >
        <CoverImageFrame className="aspect-[4/5] rounded-xl bg-muted sm:rounded-2xl">
          {product.image ? (
            <CoverImage
              alt={resolveImageAlt(product)}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(min-width: 1024px) 25vw, 50vw"
              src={product.image.url}
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
            />
          )}

          {badge ? (
            <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-foreground/75 backdrop-blur-sm">
              {badgeLabels[badge]}
            </span>
          ) : null}

          <FavoriteButton
            className="absolute top-3 right-3"
            productId={product.id}
            productName={product.name}
          />

          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </CoverImageFrame>

        <div className="mt-3 flex flex-1 flex-col sm:mt-4">
          <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug tracking-[0.01em] text-foreground transition-colors duration-300 group-hover:text-foreground/75">
            {product.name}
          </h3>

          {product.categoryName ? (
            <p className="mt-1 text-xs text-muted-foreground">{product.categoryName}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-sans text-sm font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            {hasComparePrice ? (
              <span className="font-sans text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}
          </div>

          {isOutOfStock ? (
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              Нет в наличии
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
