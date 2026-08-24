import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
  centered?: boolean;
  inverted?: boolean;
  logoUrl?: string | null;
  siteName?: string;
};

export function Logo({
  className,
  centered = false,
  inverted = false,
  logoUrl,
  siteName = siteConfig.name,
}: LogoProps) {
  if (logoUrl) {
    return (
      <Link
        aria-label={`${siteName} — на главную`}
        className={cn(
          "group inline-flex transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          centered && "items-center justify-center",
          className,
        )}
        href={siteConfig.routes.home}
      >
        <span className="relative block h-10 w-[7.5rem] overflow-hidden sm:h-11 sm:w-[8.5rem]">
          <CoverImage
            alt={siteName}
            priority
            sizes="136px"
            src={logoUrl}
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      aria-label={`${siteName} — на главную`}
      className={cn(
        "group inline-flex flex-col transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        centered && "items-center text-center",
        className,
      )}
      href={siteConfig.routes.home}
    >
      <span
        className={cn(
          "font-serif text-[1.625rem] leading-none tracking-[0.06em] sm:text-[1.875rem]",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        ROA
      </span>
      <span
        className={cn(
          "mt-0.5 font-sans text-[0.5625rem] font-medium uppercase tracking-[0.42em] sm:text-[0.625rem]",
          inverted ? "text-white/70" : "text-muted-foreground",
        )}
      >
        Jewelry
      </span>
    </Link>
  );
}
