import type { CatalogSearchParams } from "@/types/catalog";
import { siteConfig } from "@/lib/config/site-config";

type CatalogUrlParams = Partial<CatalogSearchParams>;

export function buildCategoryUrl(slug: string): string {
  return buildCatalogUrl({ category: slug });
}

export function buildCatalogUrl(params: CatalogUrlParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.minPrice !== undefined) {
    searchParams.set("minPrice", String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }

  if (params.stock === "in") {
    searchParams.set("stock", "in");
  }

  if (params.sort && params.sort !== "popular") {
    searchParams.set("sort", params.sort);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();
  return query ? `${siteConfig.routes.catalog}?${query}` : siteConfig.routes.catalog;
}

export function getCatalogHiddenFields(
  params: CatalogSearchParams,
  omit: (keyof CatalogSearchParams)[] = ["page", "limit"],
): Array<{ name: string; value: string }> {
  const fields: Array<{ name: string; value: string }> = [];

  if (!omit.includes("search") && params.search) {
    fields.push({ name: "search", value: params.search });
  }

  if (!omit.includes("category") && params.category) {
    fields.push({ name: "category", value: params.category });
  }

  if (!omit.includes("minPrice") && params.minPrice !== undefined) {
    fields.push({ name: "minPrice", value: String(params.minPrice) });
  }

  if (!omit.includes("maxPrice") && params.maxPrice !== undefined) {
    fields.push({ name: "maxPrice", value: String(params.maxPrice) });
  }

  if (!omit.includes("stock") && params.stock === "in") {
    fields.push({ name: "stock", value: "in" });
  }

  if (!omit.includes("sort") && params.sort !== "popular") {
    fields.push({ name: "sort", value: params.sort });
  }

  return fields;
}

export const catalogSortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "newest", label: "Сначала новые" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name", label: "По названию" },
] as const;
