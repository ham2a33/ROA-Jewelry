import type { HomepageCategory } from "@/types/category";
import type { ProductCardData } from "@/types/product";

export type CatalogSort =
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name";

export type CatalogStockFilter = "in";

export type CatalogSearchParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: CatalogStockFilter;
  sort: CatalogSort;
  page: number;
  limit: number;
};

export type CatalogCategory = HomepageCategory;

export type CatalogResult = {
  products: ProductCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const DEFAULT_CATALOG_SORT: CatalogSort = "popular";
export const DEFAULT_CATALOG_PAGE = 1;
export const DEFAULT_CATALOG_LIMIT = 12;
