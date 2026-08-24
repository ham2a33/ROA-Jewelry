import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CoverImage } from "@/components/ui/CoverImage";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";
import type { MediaRef } from "@/lib/media/types";
import type { HeroSectionData } from "@/types/hero";

type HeroProps = {
  data: HeroSectionData | null;
};

const bannerFrameClassName =
  "relative h-[12rem] w-full overflow-hidden rounded-xl bg-muted sm:h-[15rem] sm:rounded-2xl lg:h-[20rem]";

function resolveAlt(media: MediaRef, fallback: string): string {
  const alt = media.alt?.trim();
  return alt && alt.length > 0 ? alt : fallback;
}

type PromoBannerContentProps = {
  desktopImage: MediaRef | null;
  mobileImage: MediaRef | null;
  altFallback: string;
};

function PromoBannerContent({
  desktopImage,
  mobileImage,
  altFallback,
}: PromoBannerContentProps) {
  const desktop = desktopImage ?? mobileImage;
  const mobile = mobileImage ?? desktopImage;
  const useSeparateMobile = Boolean(mobileImage && desktopImage);

  if (!desktop && !mobile) {
    return null;
  }

  const desktopAlt = desktop ? resolveAlt(desktop, altFallback) : altFallback;
  const mobileAlt = mobile ? resolveAlt(mobile, altFallback) : altFallback;

  return (
    <>
      {useSeparateMobile && mobile ? (
        <div className={cn(bannerFrameClassName, "lg:hidden")}>
          <CoverImage
            alt={mobileAlt}
            priority
            sizes="100vw"
            src={mobile.url}
          />
        </div>
      ) : null}

      {desktop ? (
        <div
          className={cn(
            bannerFrameClassName,
            useSeparateMobile ? "hidden lg:block" : undefined,
          )}
        >
          <CoverImage
            alt={desktopAlt}
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            src={desktop.url}
          />
        </div>
      ) : null}
    </>
  );
}

export function Hero({ data }: HeroProps) {
  const pageTitle = data?.title ?? siteConfig.name;
  const bannerHref =
    data?.buttonText && data?.buttonUrl ? data.buttonUrl : null;
  const hasImage = Boolean(data?.image || data?.mobileImage);

  const bannerContent = hasImage && data ? (
    <PromoBannerContent
      altFallback={pageTitle}
      desktopImage={data.image}
      mobileImage={data.mobileImage}
    />
  ) : (
    <div aria-hidden="true" className={bannerFrameClassName} />
  );

  const banner = bannerHref ? (
    <Link
      aria-label={pageTitle}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={bannerHref}
    >
      {bannerContent}
    </Link>
  ) : (
    bannerContent
  );

  return (
    <section aria-label="Главная фотосекция" className="bg-background">
      <h1 className="sr-only">{pageTitle}</h1>
      <Container as="div" className="pt-5 pb-1 sm:pt-7 sm:pb-2 lg:pt-8 lg:pb-3">
        {banner}
      </Container>
    </section>
  );
}
