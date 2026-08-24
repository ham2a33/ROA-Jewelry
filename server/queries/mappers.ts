import "server-only";

import type { MediaRef } from "@/lib/media/types";
import type { HomepageCategory } from "@/types/category";
import type { HeroSectionData, HeroSettings } from "@/types/hero";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

export function toMediaRef(media: MediaRecord | null | undefined): MediaRef | null {
  if (!media) {
    return null;
  }

  return {
    id: media.id,
    url: media.url,
    alt: media.alt,
    width: media.width,
    height: media.height,
    mimeType: media.mimeType,
  };
}

export function mapHeroSection(section: {
  id: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  settings: unknown;
  image: MediaRecord | null;
  mobileImage: MediaRecord | null;
}): HeroSectionData {
  const settings = (section.settings ?? {}) as HeroSettings;

  return {
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    buttonText: section.buttonText,
    buttonUrl: section.buttonUrl,
    overline: settings.overline ?? null,
    image: toMediaRef(section.image),
    mobileImage: toMediaRef(section.mobileImage),
  };
}

export function mapHomepageCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: MediaRecord | null;
}): HomepageCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: toMediaRef(category.image),
  };
}
