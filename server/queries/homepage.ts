import "server-only";

import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/config/site-config";
import { mapAboutSection } from "@/server/queries/about-mappers";
import { mapBenefitsSection } from "@/server/queries/benefits-mappers";
import { mapFinalCtaSection } from "@/server/queries/final-cta-mappers";
import { getHomepagePromoBannerSection } from "@/server/queries/homepage-promo-banner";
import {
  mapProductCard,
  productCardSelect,
  type ProductCardRecord,
} from "@/server/queries/product-mappers";
import type { AboutSectionData } from "@/types/about";
import type { BenefitsSectionData } from "@/types/benefits";
import type { BestsellersSectionData } from "@/types/bestsellers";
import type { FinalCtaSectionData } from "@/types/final-cta";
import type { HeroSectionData } from "@/types/hero";
import type { NewArrivalsSectionData } from "@/types/new-arrivals";
import type { ProductCardData } from "@/types/product";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

const DEFAULT_HOMEPAGE_PRODUCT_LIMIT = 4;

const heroInclude = {
  image: {
    select: {
      id: true,
      url: true,
      alt: true,
      width: true,
      height: true,
      mimeType: true,
    },
  },
  mobileImage: {
    select: {
      id: true,
      url: true,
      alt: true,
      width: true,
      height: true,
      mimeType: true,
    },
  },
} as const;

async function getNewArrivalFallbackProducts(
  limit = DEFAULT_HOMEPAGE_PRODUCT_LIMIT,
): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isNew: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productCardSelect,
  });

  return products.map((product) =>
    mapProductCard(product as ProductCardRecord),
  );
}

function resolveProductLimit(settings: unknown): number | null {
  if (!settings || typeof settings !== "object") {
    return DEFAULT_HOMEPAGE_PRODUCT_LIMIT;
  }

  const limit = (settings as { limit?: unknown }).limit;
  if (typeof limit === "number" && limit > 0) {
    return limit;
  }

  return DEFAULT_HOMEPAGE_PRODUCT_LIMIT;
}

async function getBestsellerFallbackProducts(): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isBestseller: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: productCardSelect,
  });

  return products.map((product) =>
    mapProductCard(product as ProductCardRecord),
  );
}

export async function getHeroSection(): Promise<HeroSectionData | null> {
  await requireRuntimeAccess();
  return getHomepagePromoBannerSection();
}

export async function getBestsellersSection(): Promise<BestsellersSectionData | null> {
  await requireRuntimeAccess();
  try {
    const section = await prisma.homepageSection.findFirst({
      where: {
        key: siteConfig.homepageSectionKeys.bestsellers,
        type: "BESTSELLERS",
        isActive: true,
      },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              select: {
                ...productCardSelect,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!section) {
      return null;
    }

    let products = section.items
      .filter((item) => item.product?.isActive)
      .map((item) => mapProductCard(item.product as ProductCardRecord));

    if (products.length === 0) {
      products = await getBestsellerFallbackProducts();
    }

    if (products.length === 0) {
      return null;
    }

    return {
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      products,
    };
  } catch (error) {
    console.error("[getBestsellersSection]", error);
    return null;
  }
}

export async function getNewArrivalsSection(): Promise<NewArrivalsSectionData | null> {
  await requireRuntimeAccess();
  try {
    const section = await prisma.homepageSection.findFirst({
      where: {
        key: siteConfig.homepageSectionKeys.newArrivals,
        type: "NEW_ARRIVALS",
        isActive: true,
      },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              select: {
                ...productCardSelect,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!section) {
      return null;
    }

    const limit = resolveProductLimit(section.settings);

    let products = section.items
      .filter((item) => item.product?.isActive)
      .map((item) => mapProductCard(item.product as ProductCardRecord));

    if (products.length === 0) {
      products = await getNewArrivalFallbackProducts(limit ?? DEFAULT_HOMEPAGE_PRODUCT_LIMIT);
    } else if (limit !== null) {
      products = products.slice(0, limit);
    }

    if (products.length === 0) {
      return null;
    }

    return {
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      products,
    };
  } catch (error) {
    console.error("[getNewArrivalsSection]", error);
    return null;
  }
}

export async function getBenefitsSection(): Promise<BenefitsSectionData | null> {
  await requireRuntimeAccess();
  try {
    const section = await prisma.homepageSection.findFirst({
      where: {
        key: siteConfig.homepageSectionKeys.benefits,
        type: "BENEFITS",
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        settings: true,
      },
    });

    if (!section) {
      return null;
    }

    return mapBenefitsSection(section);
  } catch (error) {
    console.error("[getBenefitsSection]", error);
    return null;
  }
}

export async function getAboutSection(): Promise<AboutSectionData | null> {
  await requireRuntimeAccess();
  try {
    const section = await prisma.homepageSection.findFirst({
      where: {
        key: siteConfig.homepageSectionKeys.about,
        type: "ABOUT",
        isActive: true,
      },
      include: heroInclude,
    });

    if (!section) {
      return null;
    }

    return mapAboutSection(section);
  } catch (error) {
    console.error("[getAboutSection]", error);
    return null;
  }
}

export async function getFinalCtaSection(): Promise<FinalCtaSectionData | null> {
  await requireRuntimeAccess();
  try {
    const section = await prisma.homepageSection.findFirst({
      where: {
        key: siteConfig.homepageSectionKeys.finalCta,
        type: "FINAL_CTA",
        isActive: true,
      },
      include: heroInclude,
    });

    if (!section) {
      return null;
    }

    return mapFinalCtaSection(section);
  } catch (error) {
    console.error("[getFinalCtaSection]", error);
    return null;
  }
}
