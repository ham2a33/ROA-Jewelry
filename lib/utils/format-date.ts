import { siteConfig } from "@/lib/config/site-config";

export function formatDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: siteConfig.defaultTimezone,
  }).format(date);
}

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: siteConfig.defaultTimezone,
  }).format(date);
}

export function formatRelativeDay(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(siteConfig.locale, {
    timeZone: siteConfig.defaultTimezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const dateKey = formatter.format(date);
  const todayKey = formatter.format(now);

  if (dateKey === todayKey) {
    return `Сегодня ${new Intl.DateTimeFormat(siteConfig.locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: siteConfig.defaultTimezone,
    }).format(date)}`;
  }

  return formatDateTime(date);
}
