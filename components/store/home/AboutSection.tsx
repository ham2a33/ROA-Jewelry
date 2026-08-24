import { Container } from "@/components/ui/Container";
import { HeroCta } from "@/components/store/home/HeroCta";
import { HeroImage } from "@/components/store/home/HeroImage";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";
import type { AboutSectionData } from "@/types/about";

type AboutSectionProps = {
  section: AboutSectionData | null;
};

export function AboutSection({ section }: AboutSectionProps) {
  if (!section) {
    return null;
  }

  const showCta = Boolean(section.buttonText && section.buttonUrl);
  const hasImage = Boolean(section.image || section.mobileImage);
  const imageFirst = section.imagePosition === "left";
  const altFallback = section.title ?? siteConfig.name;

  return (
    <section aria-labelledby="about-heading" className="bg-background">
      <Container as="div" className="py-14 sm:py-20 lg:py-24">
        <div
          className={cn(
            hasImage
              ? "grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20"
              : "mx-auto max-w-2xl text-center",
          )}
        >
          {hasImage ? (
            <div
              className={cn(
                "reveal-up overflow-hidden rounded-2xl",
                imageFirst ? "lg:order-1" : "order-1 lg:order-2",
              )}
            >
              <HeroImage
                altFallback={altFallback}
                className="aspect-[5/4] w-full sm:aspect-[16/12] lg:aspect-[4/3]"
                desktopImage={section.image}
                mobileImage={section.mobileImage}
              />
            </div>
          ) : null}

          <div
            className={cn(
              "flex flex-col justify-center",
              hasImage
                ? cn(
                    imageFirst ? "order-2 lg:order-2" : "order-2 lg:order-1",
                  )
                : "",
            )}
          >
            {section.overline ? (
              <p className="reveal-up-delay-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground sm:text-xs">
                {section.overline}
              </p>
            ) : null}

            {section.title ? (
              <h2
                className={cn(
                  "font-serif text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] tracking-[0.02em] text-foreground uppercase",
                  section.overline ? "reveal-up-delay-2 mt-4 sm:mt-5" : "reveal-up mt-0",
                )}
                id="about-heading"
              >
                {section.title}
              </h2>
            ) : (
              <h2 className="sr-only" id="about-heading">
                О бренде
              </h2>
            )}

            {section.description ? (
              <p
                className={cn(
                  "reveal-up-delay-3 mt-5 max-w-md text-sm leading-[1.75] text-muted-foreground sm:mt-6 sm:text-[0.9375rem]",
                  !hasImage && "mx-auto",
                )}
              >
                {section.description}
              </p>
            ) : null}

            {showCta ? (
              <div
                className={cn(
                  "reveal-up-delay-3 mt-8 sm:mt-9",
                  !hasImage && "flex justify-center",
                )}
              >
                <HeroCta
                  text={section.buttonText!}
                  url={section.buttonUrl!}
                  variant="secondary"
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
