import {
  MAX_IMAGE_SIZE,
  MEDIA_UPLOAD_MIME_TYPES,
} from "@/lib/media/constants";

export const siteConfig = {
  name: "ROA Jewelry",
  locale: "ru-KZ",
  htmlLang: "ru",
  currency: "KZT",
  currencyLocale: "ru-KZ",
  defaultTimezone: "Asia/Almaty",
  routes: {
    home: "/",
    catalog: "/catalog",
    category: (slug: string) => `/catalog?category=${encodeURIComponent(slug)}`,
    product: (slug: string) => `/product/${slug}`,
    favorites: "/favorites",
    cart: "/cart",
    checkout: "/checkout",
    checkoutSuccess: "/checkout/success",
    about: "/about",
    delivery: "/delivery",
    reviews: "/reviews",
    contacts: "/contacts",
    returns: "/returns",
    privacy: "/privacy",
    offer: "/offer",
    admin: {
      login: "/admin/login",
      dashboard: "/admin",
      orders: "/admin/orders",
      products: "/admin/products",
      categories: "/admin/categories",
      collections: "/admin/collections",
      customers: "/admin/customers",
      reviews: "/admin/reviews",
      homepage: "/admin/homepage",
      banners: "/admin/banners",
      media: "/admin/media",
      settings: "/admin/settings",
      settingsGeneral: "/admin/settings/general",
      settingsContact: "/admin/settings/contact",
      settingsSocial: "/admin/settings/social",
      settingsSeo: "/admin/settings/seo",
      admins: "/admin/admins",
      profile: "/admin/profile",
    },
  },
  media: {
    maxUploadBytes: MAX_IMAGE_SIZE,
    allowedImageMimeTypes: MEDIA_UPLOAD_MIME_TYPES,
  },
  footer: {
    tagline:
      "Ювелирные украшения из серебра 925 пробы. Созданы, чтобы оставаться с вами надолго.",
    country: "Казахстан",
    copyrightYear: 2026,
  },
  catalog: {
    overline: "ROA JEWELRY",
    title: "Каталог",
    description:
      "Серебряные украшения ROA Jewelry — кольца, серьги, подвески и аксессуары из серебра 925 пробы.",
  },
  contact: {
    phone: "" as string,
    whatsappUrl: "" as string,
    instagramUrl: "" as string,
    instagramHandle: "" as string,
    address: "" as string,
  },
  social: {
    instagram: "" as string,
    telegram: "" as string,
    whatsapp: "" as string,
  },
  homepageSectionKeys: {
    homepagePromoBanner: "homepage_promo_banner",
    hero: "homepage_promo_banner",
    categories: "categories",
    bestsellers: "bestsellers",
    newArrivals: "new-arrivals",
    featured: "featured",
    promo: "promo",
    benefits: "benefits",
    about: "about",
    finalCta: "final-cta",
    reviews: "reviews",
    instagram: "instagram",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
