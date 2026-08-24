import { siteConfig } from "@/lib/config/site-config";

export function formatPrice(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat(siteConfig.currencyLocale, {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}
