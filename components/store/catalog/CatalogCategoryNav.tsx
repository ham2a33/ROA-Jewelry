import Link from "next/link";
import { buildCatalogUrl } from "@/lib/catalog/url";
import { cn } from "@/lib/utils/cn";
import type { CatalogCategory, CatalogSearchParams } from "@/types/catalog";

type CatalogCategoryNavProps = {
  categories: CatalogCategory[];
  params: CatalogSearchParams;
};

export function CatalogCategoryNav({
  categories,
  params,
}: CatalogCategoryNavProps) {
  const activeCategory = params.category;

  return (
    <nav
      aria-label="Категории каталога"
      className="-mx-4 mt-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="flex min-w-max items-center gap-2 pb-1 sm:gap-2.5">
        <li>
          <Link
            className={cn(
              "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              !activeCategory
                ? "border-foreground/15 bg-foreground text-background"
                : "border-border/80 bg-card text-foreground hover:border-foreground/20 hover:bg-muted/60",
            )}
            href={buildCatalogUrl({
              search: params.search,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              stock: params.stock,
              sort: params.sort,
            })}
          >
            Все
          </Link>
        </li>

        {categories.map((category) => {
          const isActive = activeCategory === category.slug;

          return (
            <li key={category.id}>
              <Link
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-foreground/15 bg-foreground text-background"
                    : "border-border/80 bg-card text-foreground hover:border-foreground/20 hover:bg-muted/60",
                )}
                href={buildCatalogUrl({
                  search: params.search,
                  category: category.slug,
                  minPrice: params.minPrice,
                  maxPrice: params.maxPrice,
                  stock: params.stock,
                  sort: params.sort,
                })}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
