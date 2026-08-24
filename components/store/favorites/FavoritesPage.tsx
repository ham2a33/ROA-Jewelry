"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Container } from "@/components/ui/Container";
import { useFavorites } from "@/components/store/favorites/FavoritesProvider";
import { ProductCard } from "@/components/store/product/ProductCard";
import { FavoriteButton } from "@/components/store/product/FavoriteButton";
import { StoreEmptyState } from "@/components/store/shared/StoreEmptyState";
import { StorePageHeader } from "@/components/store/shared/StorePageHeader";
import { syncFavoriteIds } from "@/lib/favorites/store";
import { fetchFavoriteProducts } from "@/server/actions/favorites";
import { siteConfig } from "@/lib/config/site-config";
import type { FavoriteProductData } from "@/server/queries/favorites";

function FavoritesGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <div className="animate-pulse">
            <div className="aspect-[4/5] rounded-xl bg-muted" />
            <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function FavoriteUnavailableCard({ product }: { product: FavoriteProductData }) {
  return (
    <article className="relative flex h-full flex-col opacity-80">
      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:rounded-2xl">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
          />
        </div>
        <FavoriteButton
          className="absolute top-3 right-3"
          productId={product.id}
          productName={product.name}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Товар больше недоступен
        </p>
      </div>
    </article>
  );
}

export function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState<FavoriteProductData[]>([]);
  const [isPending, startTransition] = useTransition();

  const favoriteIdsKey = favoriteIds.join(",");
  const loadedFavoriteIdsKey = useMemo(
    () => products.map((product) => product.id).join(","),
    [products],
  );
  const needsFetch =
    favoriteIds.length > 0 && favoriteIdsKey !== loadedFavoriteIdsKey;

  useEffect(() => {
    if (!needsFetch) {
      return;
    }

    let cancelled = false;

    startTransition(() => {
      void fetchFavoriteProducts(favoriteIds)
        .then(({ products: nextProducts, missingIds }) => {
          if (cancelled) {
            return;
          }

          setProducts(nextProducts);

          if (missingIds.length > 0) {
            syncFavoriteIds(
              favoriteIds.filter((id) => !missingIds.includes(id)),
            );
          }
        })
        .catch((error) => {
          console.error("[FavoritesPage]", error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [favoriteIds, favoriteIdsKey, needsFetch]);

  const visibleProducts = useMemo(() => {
    const activeIds = new Set(favoriteIds);
    return products.filter((product) => activeIds.has(product.id));
  }, [favoriteIds, products]);

  if (favoriteIds.length === 0) {
    return (
      <Container as="div" className="py-8 sm:py-10 lg:py-14">
        <StorePageHeader title="Избранное" />
        <StoreEmptyState
          ctaHref={siteConfig.routes.catalog}
          ctaLabel="Перейти в каталог"
          description="Сохраните украшения, к которым хотите вернуться."
          title="Пока здесь пусто"
        />
      </Container>
    );
  }

  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-14">
      <StorePageHeader
        description="Сохранённые украшения, к которым вы можете вернуться в любой момент."
        title="Избранное"
      />

      {needsFetch && isPending && visibleProducts.length === 0 ? (
        <FavoritesGridSkeleton />
      ) : visibleProducts.length === 0 ? (
        <StoreEmptyState
          ctaHref={siteConfig.routes.catalog}
          ctaLabel="Перейти в каталог"
          description="Сохраните украшения, к которым хотите вернуться."
          title="Пока здесь пусто"
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <li
              className="transition-opacity duration-300 ease-out"
              key={product.id}
            >
              {product.isActive ? (
                <ProductCard product={product} />
              ) : (
                <FavoriteUnavailableCard product={product} />
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
