import type { MediaRef } from "@/lib/media/types";
import type { Gender } from "@/types/index";

export type ProductPageCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductPageImage = {
  id: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  media: MediaRef;
};

export type ProductPageVariant = {
  id: string;
  name: string;
  sku: string;
  price: string | null;
  stock: number;
  image: MediaRef | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductPageData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string;
  stock: number;
  material: string | null;
  hallmark: string | null;
  weightGrams: string | null;
  gender: Gender;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  category: ProductPageCategory;
  images: ProductPageImage[];
  variants: ProductPageVariant[];
};
