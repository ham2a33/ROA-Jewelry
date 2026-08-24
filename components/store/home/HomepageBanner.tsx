import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { siteConfig } from "@/lib/config/site-config";
import type { MediaRef } from "@/lib/media/types";
import { getHomepagePromoBannerSection } from "@/server/queries/homepage-promo-banner";

const bannerFrameClassName =
  "h-[12rem] min-h-[12rem] sm:h-[15rem] sm:min-h-[15rem] lg:h-[20rem] lg:min-h-[20rem] rounded-xl border border-border/60 bg-muted sm:rounded-2xl";

function resolveAlt(media: MediaRef | null, fallback: string): string {
  const alt = media?.alt?.trim();
  return alt && alt.length > 0 ? alt : fallback;
}

function resolveImageUrl(
  primary: MediaRef | null,
  fallback: MediaRef | null,
): string | null {
  const url = primary?.url?.trim() || fallback?.url?.trim();
  return url && url.length > 0 ? url : null;
}

type BannerFrameProps = {
  alt: string;
  desktopUrl: string | null;
  mobileUrl: string | null;
};

function BannerResponsivePicture({
  alt,
  desktopUrl,
  mobileUrl,
}: {
  alt: string;
  desktopUrl: string;
  mobileUrl: string;
}) {
  return (
    <picture className="block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={desktopUrl} />
      <img
        alt={alt}
        className="h-full w-full object-cover object-center"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={mobileUrl}
      />
    </picture>
  );
}

function BannerFrame({ alt, desktopUrl, mobileUrl }: BannerFrameProps) {
  const imageUrl = desktopUrl ?? mobileUrl;
  const useSeparateMobile = Boolean(
    mobileUrl && desktopUrl && mobileUrl !== desktopUrl,
  );

  return (
    <div data-homepage-banner-frame>
      <CoverImageFrame className={`homepage-banner-frame ${bannerFrameClassName}`}>
        {imageUrl ? (
          useSeparateMobile ? (
            <BannerResponsivePicture
              alt={alt}
              desktopUrl={desktopUrl!}
              mobileUrl={mobileUrl!}
            />
          ) : (
            <CoverImage
              alt={alt}
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              src={imageUrl}
            />
          )
        ) : null}
      </CoverImageFrame>
    </div>
  );
}

export async function HomepageBanner() {
  const data = await getHomepagePromoBannerSection();
  const pageTitle = data?.title ?? siteConfig.name;
  const desktopImage = data?.image ?? null;
  const mobileImage = data?.mobileImage ?? null;
  const desktopUrl = resolveImageUrl(desktopImage, mobileImage);
  const mobileUrl = resolveImageUrl(mobileImage, desktopImage);
  const alt = resolveAlt(desktopImage ?? mobileImage, pageTitle);
  const bannerHref =
    data?.buttonText && data?.buttonUrl ? data.buttonUrl : null;

  const bannerFrame = (
    <BannerFrame
      alt={alt}
      desktopUrl={desktopUrl}
      mobileUrl={mobileUrl}
    />
  );

  const banner = bannerHref ? (
    <Link
      aria-label={pageTitle}
      className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={bannerHref}
    >
      {bannerFrame}
    </Link>
  ) : (
    bannerFrame
  );

  return (
    <section
      aria-label="Главная — баннер"
      className="bg-background"
      data-homepage-banner
    >
      <h1 className="sr-only">{pageTitle}</h1>
      <Container as="div" className="pt-5 pb-2 sm:pt-7 sm:pb-3 lg:pt-8 lg:pb-4">
        {banner}
      </Container>
    </section>
  );
}
