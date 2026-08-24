export const HOMEPAGE_PROMO_BANNER_SLOT = {
  key: "homepage_promo_banner",
  label: "Главная — баннер",
  type: "HERO" as const,
  legacyKey: "hero",
} as const;

export function getHomepageSectionDisplayName(key: string, title?: string | null) {
  if (key === HOMEPAGE_PROMO_BANNER_SLOT.key) {
    return HOMEPAGE_PROMO_BANNER_SLOT.label;
  }

  return title ?? key;
}
