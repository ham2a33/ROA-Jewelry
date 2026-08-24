import { z } from "zod";
import {
  emailSchema,
  idSchema,
  moneySchema,
  ratingSchema,
  slugSchema,
  sortOrderSchema,
  weightSchema,
} from "./common";

export const genderSchema = z.enum(["WOMEN", "MEN", "UNISEX"]);
export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);
export const homepageSectionTypeSchema = z.enum([
  "HERO",
  "CATEGORIES",
  "BESTSELLERS",
  "NEW_ARRIVALS",
  "FEATURED",
  "PROMO",
  "BENEFITS",
  "ABOUT",
  "FINAL_CTA",
  "REVIEWS",
  "INSTAGRAM",
  "CUSTOM",
]);
export const mediaKindSchema = z.enum(["IMAGE", "VIDEO", "DOCUMENT", "OTHER"]);
export const userRoleSchema = z.enum(["ADMIN", "MANAGER"]);

export const mediaCreateSchema = z.object({
  alt: z.string().optional(),
  folder: z.string().optional(),
  kind: mediaKindSchema.default("IMAGE"),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  imageId: idSchema.optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: sortOrderSchema.default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const productInputSchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: moneySchema,
  compareAtPrice: moneySchema.optional().nullable(),
  sku: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  material: z.string().optional(),
  hallmark: z.string().optional(),
  weightGrams: weightSchema.optional().nullable(),
  gender: genderSchema.default("UNISEX"),
  categoryId: idSchema,
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const productImageInputSchema = z.object({
  mediaId: idSchema,
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
});

export const productVariantInputSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: moneySchema.optional().nullable(),
  stock: z.number().int().min(0).default(0),
  imageId: idSchema.optional().nullable(),
  attributes: z.record(z.string(), z.string()).optional(),
  isActive: z.boolean().default(true),
  sortOrder: sortOrderSchema.default(0),
});

export const homepageSectionInputSchema = z.object({
  type: homepageSectionTypeSchema,
  key: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  imageId: idSchema.optional().nullable(),
  mobileImageId: idSchema.optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: sortOrderSchema.default(0),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const homepageSectionItemInputSchema = z.object({
  productId: idSchema.optional().nullable(),
  categoryId: idSchema.optional().nullable(),
  mediaId: idSchema.optional().nullable(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: sortOrderSchema.default(0),
});

export const bannerInputSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageId: idSchema,
  mobileImageId: idSchema.optional().nullable(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: sortOrderSchema.default(0),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
});

export const siteSettingsInputSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  logoId: idSchema.optional().nullable(),
  faviconId: idSchema.optional().nullable(),
  defaultOgImageId: idSchema.optional().nullable(),
  contactEmail: emailSchema.optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  whatsappUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: "Укажите корректный номер WhatsApp, например 77064126564" },
    ),
  telegramUrl: z.string().url().optional().or(z.literal("")),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
});

export const customerInputSchema = z.object({
  email: emailSchema,
  name: z.string().min(1),
  phone: z.string().optional(),
});

export const reviewInputSchema = z.object({
  productId: idSchema.optional().nullable(),
  customerId: idSchema.optional().nullable(),
  authorName: z.string().min(1),
  rating: ratingSchema,
  title: z.string().optional(),
  body: z.string().min(1),
});

export const cartItemInputSchema = z.object({
  productId: idSchema,
  variantId: idSchema.optional().nullable(),
  quantity: z.number().int().min(1),
});

export const favoriteInputSchema = z.object({
  productId: idSchema,
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export const bootstrapAdminSchema = z.object({
  name: z.string().trim().min(1, "Введите имя"),
  email: z
    .string()
    .trim()
    .min(1, "Введите email")
    .email("Введите корректный email"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов"),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type HomepageSectionInput = z.infer<typeof homepageSectionInputSchema>;
export type BannerInput = z.infer<typeof bannerInputSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;
export type CustomerInput = z.infer<typeof customerInputSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type CartItemInput = z.infer<typeof cartItemInputSchema>;
