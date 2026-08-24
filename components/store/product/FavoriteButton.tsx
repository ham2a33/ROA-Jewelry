"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/store/favorites/FavoritesProvider";
import { cn } from "@/lib/utils/cn";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
  className?: string;
  onToggle?: (productId: string, isFavorite: boolean) => void;
};

export function FavoriteButton({
  productId,
  productName,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);

  return (
    <button
      aria-label={
        favorite
          ? `Убрать «${productName}» из избранного`
          : `Добавить «${productName}» в избранное`
      }
      aria-pressed={favorite}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground/70 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        favorite && "border-foreground/15 text-foreground",
        className,
      )}
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(productId);
        onToggle?.(productId, !favorite);
      }}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          favorite && "scale-105 fill-current",
        )}
        strokeWidth={1.5}
      />
    </button>
  );
}
