import { siteConfig } from "@/lib/config/site-config";

export function formatMoney(
  value: string | number,
  locale = siteConfig.currencyLocale,
  currency = siteConfig.currency,
): string {
  const amount = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}
