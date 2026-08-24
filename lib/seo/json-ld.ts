import { getSiteUrl, siteConfig } from "@/lib/config/site-config";

export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    url: getSiteUrl(),
  };
}

export function productJsonLd(input: {
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  price: string;
  currency?: string;
  imageUrls?: string[];
  inStock?: boolean;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description ?? undefined,
    sku: input.sku ?? undefined,
    image: input.imageUrls,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    url: `${getSiteUrl()}/product/${input.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: input.currency ?? siteConfig.currency,
      price: input.price,
      availability:
        input.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data);
}
