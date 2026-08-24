"use client";

import { useRouter } from "next/navigation";
import { buildCatalogUrl, catalogSortOptions } from "@/lib/catalog/url";
import type { CatalogSearchParams } from "@/types/catalog";

type CatalogSortControlProps = {
  params: CatalogSearchParams;
};

export function CatalogSortControl({ params }: CatalogSortControlProps) {
  const router = useRouter();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <label
        className="sr-only"
        htmlFor="catalog-sort"
      >
        Сортировка
      </label>
      <select
        className="min-h-11 max-w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        id="catalog-sort"
        onChange={(event) => {
          router.push(
            buildCatalogUrl({
              search: params.search,
              category: params.category,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              stock: params.stock,
              sort: event.target.value as CatalogSearchParams["sort"],
            }),
          );
        }}
        value={params.sort}
      >
        {catalogSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
