import "server-only";

import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/config/site-config";
import { parseStoredWhatsAppNumber } from "@/lib/utils/whatsapp";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export type ResolvedSiteSettings = {
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  defaultOgImageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  telegramUrl: string | null;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
};

export async function getSiteSettingsRecord() {
  await requireRuntimeAccess();
  return prisma.siteSettings.findUnique({
    where: { id: "default" },
    include: {
      logo: true,
      favicon: true,
      defaultOgImage: true,
    },
  });
}

export async function getResolvedSiteSettings(): Promise<ResolvedSiteSettings> {
  await requireRuntimeAccess();
  const settings = await getSiteSettingsRecord();

  return {
    siteName: settings?.siteName ?? siteConfig.name,
    tagline: settings?.tagline ?? null,
    logoUrl: settings?.logo?.url ?? null,
    faviconUrl: settings?.favicon?.url ?? null,
    defaultOgImageUrl: settings?.defaultOgImage?.url ?? null,
    contactEmail: settings?.contactEmail ?? null,
    contactPhone:
      settings?.contactPhone ?? (siteConfig.contact.phone || null),
    address: settings?.address ?? (siteConfig.contact.address || null),
    instagramUrl:
      settings?.instagramUrl ?? (siteConfig.social.instagram || null),
    whatsappUrl:
      parseStoredWhatsAppNumber(settings?.whatsappUrl) ??
      parseStoredWhatsAppNumber(siteConfig.contact.whatsappUrl) ??
      null,
    telegramUrl:
      settings?.telegramUrl ?? (siteConfig.social.telegram || null),
    defaultSeoTitle: settings?.defaultSeoTitle ?? null,
    defaultSeoDescription: settings?.defaultSeoDescription ?? null,
  };
}

export async function ensureSiteSettings() {
  await requireRuntimeAccess();
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: siteConfig.name,
    },
  });
}
