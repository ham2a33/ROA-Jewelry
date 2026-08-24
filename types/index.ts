import type { MediaRef } from "@/lib/media/types";

export type Gender = "WOMEN" | "MEN" | "UNISEX";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type HomepageSectionType =
  | "HERO"
  | "CATEGORIES"
  | "BESTSELLERS"
  | "NEW_ARRIVALS"
  | "FEATURED"
  | "PROMO"
  | "BENEFITS"
  | "ABOUT"
  | "FINAL_CTA"
  | "REVIEWS"
  | "INSTAGRAM"
  | "CUSTOM";

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: MediaRef | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
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
  isActive: boolean;
  primaryImage: MediaRef | null;
  category: Pick<CategorySummary, "id" | "name" | "slug">;
};

export type ProductImageItem = {
  id: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  media: MediaRef;
};

export type ProductVariantItem = {
  id: string;
  name: string;
  sku: string;
  price: string | null;
  stock: number;
  image: MediaRef | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductDetail = ProductSummary & {
  description: string | null;
  images: ProductImageItem[];
  variants: ProductVariantItem[];
};

export type HomepageSectionItem = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  media: MediaRef | null;
  product: ProductSummary | null;
  category: CategorySummary | null;
};

export type HomepageSection = {
  id: string;
  type: HomepageSectionType;
  key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  image: MediaRef | null;
  mobileImage: MediaRef | null;
  isActive: boolean;
  sortOrder: number;
  items: HomepageSectionItem[];
};

export type BannerItem = {
  id: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  image: MediaRef;
  mobileImage: MediaRef | null;
  isActive: boolean;
  sortOrder: number;
};

export type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  images: MediaRef[];
  createdAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  product: ProductSummary;
  variant: ProductVariantItem | null;
};
