import "server-only";

import { prisma } from "@/lib/db";
import { HOMEPAGE_PROMO_BANNER_SLOT } from "@/lib/homepage/image-slots";
import { mapHeroSection } from "@/server/queries/mappers";
import type { HeroSectionData } from "@/types/hero";

const promoBannerInclude = {
  image: true,
  mobileImage: true,
} as const;

const promoBannerWhere = {
  type: HOMEPAGE_PROMO_BANNER_SLOT.type,
  isActive: true,
} as const;

export async function ensureHomepagePromoBannerSection() {
  const existing = await prisma.homepageSection.findUnique({
    where: { key: HOMEPAGE_PROMO_BANNER_SLOT.key },
    include: promoBannerInclude,
  });

  if (existing) {
    return existing;
  }

  const legacyHero = await prisma.homepageSection.findUnique({
    where: { key: HOMEPAGE_PROMO_BANNER_SLOT.legacyKey },
    include: promoBannerInclude,
  });

  if (legacyHero) {
    return prisma.homepageSection.update({
      where: { id: legacyHero.id },
      data: {
        key: HOMEPAGE_PROMO_BANNER_SLOT.key,
        type: HOMEPAGE_PROMO_BANNER_SLOT.type,
        title: legacyHero.title ?? HOMEPAGE_PROMO_BANNER_SLOT.label,
      },
      include: promoBannerInclude,
    });
  }

  return prisma.homepageSection.create({
    data: {
      key: HOMEPAGE_PROMO_BANNER_SLOT.key,
      type: HOMEPAGE_PROMO_BANNER_SLOT.type,
      title: HOMEPAGE_PROMO_BANNER_SLOT.label,
      isActive: true,
      sortOrder: 0,
    },
    include: promoBannerInclude,
  });
}

async function findActivePromoBannerSection() {
  const preferred = await prisma.homepageSection.findFirst({
    where: {
      ...promoBannerWhere,
      key: HOMEPAGE_PROMO_BANNER_SLOT.key,
    },
    include: promoBannerInclude,
  });

  if (preferred) {
    return preferred;
  }

  return prisma.homepageSection.findFirst({
    where: {
      ...promoBannerWhere,
      key: HOMEPAGE_PROMO_BANNER_SLOT.legacyKey,
    },
    include: promoBannerInclude,
  });
}

export async function getHomepagePromoBannerSection(): Promise<HeroSectionData | null> {
  try {
    let section = await findActivePromoBannerSection();

    if (!section) {
      section = await ensureHomepagePromoBannerSection();
    }

    if (!section.isActive) {
      return null;
    }

    return mapHeroSection(section);
  } catch (error) {
    console.error("[getHomepagePromoBannerSection]", error);
    return null;
  }
}

export async function getHomepagePromoBannerSectionForAdmin() {
  return ensureHomepagePromoBannerSection();
}
