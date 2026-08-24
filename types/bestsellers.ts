import type { ProductCardData } from "@/types/product";

export type BestsellersSectionData = {
  id: string;
  title: string | null;
  subtitle: string | null;
  products: ProductCardData[];
};
