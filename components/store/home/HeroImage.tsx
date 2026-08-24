import { cn } from "@/lib/utils/cn";
import { CoverImage } from "@/components/ui/CoverImage";
import type { MediaRef } from "@/lib/media/types";

type HeroImageProps = {
  desktopImage: MediaRef | null;
  mobileImage: MediaRef | null;
  altFallback: string;
  className?: string;
  priority?: boolean;
};

function resolveAlt(media: MediaRef | null, fallback: string): string {
  const alt = media?.alt?.trim();
  return alt && alt.length > 0 ? alt : fallback;
}

function HeroImageFrame({
  media,
  alt,
  priority,
  className,
  sizes,
}: {
  media: MediaRef;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <CoverImage
        alt={alt}
        priority={priority}
        sizes={sizes}
        src={media.url}
      />
    </div>
  );
}

export function HeroImage({
  desktopImage,
  mobileImage,
  altFallback,
  className,
  priority = true,
}: HeroImageProps) {
  const desktop = desktopImage ?? mobileImage;
  const mobile = mobileImage ?? desktopImage;
  const useSeparateMobile = Boolean(mobileImage && desktopImage);

  if (!desktop && !mobile) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "bg-gradient-to-br from-muted via-card to-muted/80",
          className,
        )}
      />
    );
  }

  const desktopAlt = resolveAlt(desktop, altFallback);
  const mobileAlt = resolveAlt(mobile, altFallback);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {useSeparateMobile && mobile ? (
        <HeroImageFrame
          alt={mobileAlt}
          className="lg:hidden"
          media={mobile}
          priority={priority}
          sizes="100vw"
        />
      ) : null}

      {desktop ? (
        <HeroImageFrame
          alt={desktopAlt}
          className={useSeparateMobile ? "hidden lg:block" : undefined}
          media={desktop}
          priority={priority}
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      ) : null}
    </div>
  );
}
