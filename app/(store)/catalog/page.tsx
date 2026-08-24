import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogCategoryGrid } from "@/components/store/catalog/CatalogCategoryGrid";
import { CatalogEmptyState } from "@/components/store/catalog/CatalogEmptyState";
import { CatalogFilterDrawer } from "@/components/store/catalog/CatalogFilterDrawer";
import { CatalogFilterForm } from "@/components/store/catalog/CatalogFilterForm";
import { CatalogHero } from "@/components/store/catalog/CatalogHero";
import { CatalogPagination } from "@/components/store/catalog/CatalogPagination";
import { CatalogProductGrid } from "@/components/store/catalog/CatalogProductGrid";
import { CatalogSearchForm } from "@/components/store/catalog/CatalogSearchForm";
import { CatalogSortControl } from "@/components/store/catalog/CatalogSortControl";
import { siteConfig } from "@/lib/config/site-config";
import { parseCatalogSearchParams } from "@/lib/validations/catalog-params";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  getCatalogCategories,
  getCatalogProducts,
} from "@/server/queries/catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Каталог украшений",
  description: siteConfig.catalog.description,
  canonicalPath: siteConfig.routes.catalog,
});

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const rawParams = await searchParams;
  const params = parseCatalogSearchParams(rawParams);

  const [categories, result] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(params),
  ]);

  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-12">
      <CatalogHero />
      <CatalogCategoryGrid categories={categories} />

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/60 p-5">
            <h2 className="mb-5 font-serif text-lg tracking-[0.02em] text-foreground">
              Фильтры
            </h2>
            <CatalogFilterForm categories={categories} params={params} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <CatalogSearchForm params={params} />
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <CatalogFilterDrawer categories={categories} params={params} />
              <CatalogSortControl params={params} />
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {result.total > 0
              ? `${result.total} ${formatProductCount(result.total)}`
              : "Нет товаров по выбранным параметрам"}
          </p>

          <div className="mt-6">
            {result.products.length > 0 ? (
              <CatalogProductGrid products={result.products} />
            ) : (
              <CatalogEmptyState />
            )}
          </div>

          <CatalogPagination
            page={result.page}
            params={params}
            totalPages={result.totalPages}
          />
        </div>
      </div>
    </Container>
  );
}

function formatProductCount(total: number): string {
  const mod10 = total % 10;
  const mod100 = total % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "товар";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "товара";
  }

  return "товаров";
}
