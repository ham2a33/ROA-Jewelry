import type { ProductCardData } from "@/types/product";

export type NewArrivalsSectionData = {
  id: string;
  title: string | null;
  subtitle: string | null;
  products: ProductCardData[];
};
