import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogUrl } from "@/lib/catalog/url";
import { cn } from "@/lib/utils/cn";
import type { CatalogSearchParams } from "@/types/catalog";

type CatalogPaginationProps = {
  params: CatalogSearchParams;
  page: number;
  totalPages: number;
};

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);

  for (let offset = -1; offset <= 1; offset += 1) {
    const page = current + offset;
    if (page > 1 && page < total) {
      pages.add(page);
    }
  }

  return [...pages].sort((left, right) => left - right);
}

function buildPageUrl(params: CatalogSearchParams, page: number): string {
  return buildCatalogUrl({
    search: params.search,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    stock: params.stock,
    sort: params.sort,
    page,
  });
}

export function CatalogPagination({
  params,
  page,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Пагинация каталога"
      className="mt-10 border-t border-border/70 pt-8 sm:mt-12"
    >
      <div className="hidden items-center justify-center gap-2 sm:flex">
        <Link
          aria-disabled={!hasPrevious}
          className={cn(
            "inline-flex min-h-10 items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            hasPrevious
              ? "border-border/80 bg-card text-foreground hover:bg-muted/60"
              : "pointer-events-none border-border/50 bg-muted/40 text-muted-foreground",
          )}
          href={hasPrevious ? buildPageUrl(params, page - 1) : "#"}
          tabIndex={hasPrevious ? 0 : -1}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          Previous
        </Link>

        {visiblePages.map((pageNumber, index) => {
          const previous = visiblePages[index - 1];
          const showEllipsis = previous !== undefined && pageNumber - previous > 1;

          return (
            <span className="inline-flex items-center gap-2" key={pageNumber}>
              {showEllipsis ? (
                <span aria-hidden="true" className="px-1 text-muted-foreground">
                  ...
                </span>
              ) : null}
              <Link
                aria-current={pageNumber === page ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  pageNumber === page
                    ? "border-foreground/15 bg-foreground text-background"
                    : "border-border/80 bg-card text-foreground hover:bg-muted/60",
                )}
                href={buildPageUrl(params, pageNumber)}
              >
                {pageNumber}
              </Link>
            </span>
          );
        })}

        <Link
          aria-disabled={!hasNext}
          className={cn(
            "inline-flex min-h-10 items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            hasNext
              ? "border-border/80 bg-card text-foreground hover:bg-muted/60"
              : "pointer-events-none border-border/50 bg-muted/40 text-muted-foreground",
          )}
          href={hasNext ? buildPageUrl(params, page + 1) : "#"}
          tabIndex={hasNext ? 0 : -1}
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3 sm:hidden">
        <Link
          aria-disabled={!hasPrevious}
          className={cn(
            "inline-flex min-h-11 items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            hasPrevious
              ? "border-border/80 bg-card text-foreground hover:bg-muted/60"
              : "pointer-events-none border-border/50 bg-muted/40 text-muted-foreground",
          )}
          href={hasPrevious ? buildPageUrl(params, page - 1) : "#"}
          tabIndex={hasPrevious ? 0 : -1}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          Назад
        </Link>

        <p className="text-sm text-muted-foreground">
          Страница {page} из {totalPages}
        </p>

        <Link
          aria-disabled={!hasNext}
          className={cn(
            "inline-flex min-h-11 items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            hasNext
              ? "border-border/80 bg-card text-foreground hover:bg-muted/60"
              : "pointer-events-none border-border/50 bg-muted/40 text-muted-foreground",
          )}
          href={hasNext ? buildPageUrl(params, page + 1) : "#"}
          tabIndex={hasNext ? 0 : -1}
        >
          Далее
          <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </nav>
  );
}
