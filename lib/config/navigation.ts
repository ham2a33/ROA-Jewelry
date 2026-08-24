import { siteConfig } from "./site-config";

export type NavItem = {
  label: string;
  href: string;
};

export const headerNavigation: NavItem[] = [
  { label: "Каталог", href: siteConfig.routes.catalog },
  { label: "О нас", href: siteConfig.routes.about },
  { label: "Доставка и оплата", href: siteConfig.routes.delivery },
  { label: "Отзывы", href: siteConfig.routes.reviews },
  { label: "Контакты", href: siteConfig.routes.contacts },
];

export const mobileNavigation: NavItem[] = [
  ...headerNavigation,
  { label: "Избранное", href: siteConfig.routes.favorites },
];

export const footerCatalogNavigation: NavItem[] = [
  { label: "Кольца", href: siteConfig.routes.category("koltsa") },
  { label: "Кулоны", href: siteConfig.routes.category("kulony") },
  { label: "Браслеты", href: siteConfig.routes.category("braslety") },
  { label: "Серьги", href: siteConfig.routes.category("sergi") },
  { label: "Цепочки", href: siteConfig.routes.category("tsepochki") },
  {
    label: "Мужские украшения",
    href: siteConfig.routes.category("muzhskie-ukrasheniya"),
  },
];

export const footerInfoNavigation: NavItem[] = [
  { label: "О нас", href: siteConfig.routes.about },
  { label: "Доставка и оплата", href: siteConfig.routes.delivery },
  { label: "Возврат", href: siteConfig.routes.returns },
  { label: "Отзывы", href: siteConfig.routes.reviews },
  { label: "Контакты", href: siteConfig.routes.contacts },
];

export const footerLegalNavigation: NavItem[] = [
  { label: "Политика конфиденциальности", href: siteConfig.routes.privacy },
  { label: "Публичная оферта", href: siteConfig.routes.offer },
];
