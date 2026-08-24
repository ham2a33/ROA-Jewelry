"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/components/store/cart/CartProvider";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";

type HeaderActionsProps = {
  className?: string;
  showSearch?: boolean;
  showFavorites?: boolean;
  onSearchClick?: () => void;
  searchExpanded?: boolean;
};

const iconButtonClass =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function HeaderActions({
  className,
  showSearch = true,
  showFavorites = true,
  onSearchClick,
  searchExpanded = false,
}: HeaderActionsProps) {
  const { cartCount } = useCart();

  return (
    <div className={cn("flex items-center gap-0.5 sm:gap-1", className)}>
      {showSearch && onSearchClick ? (
        <button
          aria-expanded={searchExpanded}
          aria-label="Поиск"
          className={iconButtonClass}
          onClick={onSearchClick}
          type="button"
        >
          <Search aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      ) : null}

      {showFavorites ? (
        <Link
          aria-label="Избранное"
          className={iconButtonClass}
          href={siteConfig.routes.favorites}
        >
          <Heart aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </Link>
      ) : null}

      <Link
        aria-label={
          cartCount > 0 ? `Корзина, ${cartCount} товаров` : "Корзина"
        }
        className={iconButtonClass}
        href={siteConfig.routes.cart}
      >
        <ShoppingBag
          aria-hidden="true"
          className="h-[18px] w-[18px]"
          strokeWidth={1.5}
        />
        <Badge count={cartCount} />
      </Link>
    </div>
  );
}
