import { Container } from "@/components/ui/Container";
import { HeroCta } from "@/components/store/home/HeroCta";
import { HeroImage } from "@/components/store/home/HeroImage";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";
import type { FinalCtaSectionData } from "@/types/final-cta";

type FinalCtaSectionProps = {
  section: FinalCtaSectionData | null;
};

export function FinalCtaSection({ section }: FinalCtaSectionProps) {
  if (!section) {
    return null;
  }

  const showCta = Boolean(section.buttonText && section.buttonUrl);
  const altFallback = section.title ?? siteConfig.name;
  const hasImage = Boolean(section.image || section.mobileImage);

  return (
    <section aria-labelledby="final-cta-heading" className="bg-background">
      <Container as="div" className="pb-14 pt-4 sm:pb-20 lg:pb-24">
        <div className="relative min-h-[min(420px,68vh)] overflow-hidden rounded-2xl sm:min-h-[480px] lg:min-h-[540px]">
          <HeroImage
            altFallback={altFallback}
            className="absolute inset-0 h-full w-full"
            desktopImage={section.image}
            mobileImage={section.mobileImage}
            priority={false}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-foreground/10"
            style={hasImage ? { opacity: Math.max(section.overlay, 0.35) } : undefined}
          />

          <div
            className={cn(
              "relative z-10 flex min-h-[min(420px,68vh)] flex-col justify-center px-6 py-12 sm:min-h-[480px] sm:px-10 sm:py-16 lg:min-h-[540px] lg:px-14",
              hasImage ? "text-white" : "text-foreground",
            )}
          >
            {section.overline ? (
              <p className="reveal-up font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-white/75 sm:text-xs">
                {section.overline}
              </p>
            ) : null}

            {section.title ? (
              <h2
                className={cn(
                  "max-w-xl font-serif text-[clamp(1.75rem,4vw,3rem)] leading-[1.08] tracking-[0.02em] uppercase",
                  section.overline ? "reveal-up-delay-1 mt-4 sm:mt-5" : "reveal-up",
                )}
                id="final-cta-heading"
              >
                {section.title}
              </h2>
            ) : (
              <h2 className="sr-only" id="final-cta-heading">
                Призыв к действию
              </h2>
            )}

            {section.description ? (
              <p className="reveal-up-delay-2 mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-[0.9375rem]">
                {section.description}
              </p>
            ) : null}

            {showCta ? (
              <div className="reveal-up-delay-3 mt-8 sm:mt-9">
                <HeroCta text={section.buttonText!} url={section.buttonUrl!} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
