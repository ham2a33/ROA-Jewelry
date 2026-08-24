import { z } from "zod";
import {
  DEFAULT_CATALOG_LIMIT,
  DEFAULT_CATALOG_PAGE,
  DEFAULT_CATALOG_SORT,
  type CatalogSearchParams,
  type CatalogSort,
  type CatalogStockFilter,
} from "@/types/catalog";

const catalogSortSchema = z.enum([
  "popular",
  "newest",
  "price-asc",
  "price-desc",
  "name",
]);

const catalogStockSchema = z.enum(["in"]);

function readParam(
  input: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = input[key];
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseOptionalPrice(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function parsePage(value: string | undefined): number {
  if (!value?.trim()) {
    return DEFAULT_CATALOG_PAGE;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_CATALOG_PAGE;
  }

  return Math.floor(parsed);
}

function parseSort(value: string | undefined): CatalogSort {
  const parsed = catalogSortSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_CATALOG_SORT;
}

function parseStock(value: string | undefined): CatalogStockFilter | undefined {
  const parsed = catalogStockSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

export function parseCatalogSearchParams(
  input: Record<string, string | string[] | undefined>,
): CatalogSearchParams {
  const search = readParam(input, "search")?.trim() || undefined;
  const category = readParam(input, "category")?.trim() || undefined;

  let minPrice = parseOptionalPrice(readParam(input, "minPrice"));
  let maxPrice = parseOptionalPrice(readParam(input, "maxPrice"));

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  return {
    search,
    category,
    minPrice,
    maxPrice,
    stock: parseStock(readParam(input, "stock")),
    sort: parseSort(readParam(input, "sort")),
    page: parsePage(readParam(input, "page")),
    limit: DEFAULT_CATALOG_LIMIT,
  };
}

export { catalogSortSchema, catalogStockSchema };
