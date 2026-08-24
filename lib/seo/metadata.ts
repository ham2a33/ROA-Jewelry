import type { Metadata } from "next";
import { getSiteUrl, siteConfig } from "@/lib/config/site-config";
import type { MediaRef } from "@/lib/media/types";

type MetadataSource = {
  title?: string | null;
  description?: string | null;
  canonicalPath?: string;
  image?: MediaRef | null;
  noIndex?: boolean;
};

export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    openGraph: {
      type: "website",
      locale: siteConfig.locale.replace("-", "_"),
      siteName: siteConfig.name,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function createPageMetadata(source: MetadataSource): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = source.canonicalPath
    ? new URL(source.canonicalPath, siteUrl).toString()
    : undefined;
  const imageUrl = source.image?.url
    ? new URL(source.image.url, siteUrl).toString()
    : undefined;

  return {
    title: source.title ?? undefined,
    description: source.description ?? undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: source.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: source.title ?? siteConfig.name,
      description: source.description ?? undefined,
      url: canonical,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: source.image?.alt ?? source.title ?? siteConfig.name,
            },
          ]
        : undefined,
    },
  };
}
