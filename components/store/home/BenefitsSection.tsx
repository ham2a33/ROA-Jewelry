import { Container } from "@/components/ui/Container";
import { BenefitIcon } from "@/components/store/home/BenefitIcon";
import { cn } from "@/lib/utils/cn";
import type { BenefitsSectionData } from "@/types/benefits";

type BenefitsSectionProps = {
  section: BenefitsSectionData | null;
};

export function BenefitsSection({ section }: BenefitsSectionProps) {
  if (!section || section.items.length === 0) {
    return null;
  }

  const title = section.title ?? "Почему ROA";

  return (
    <section
      aria-labelledby="benefits-heading"
      className="border-y border-border/50 bg-background"
    >
      <Container as="div" className="py-10 sm:py-12 lg:py-14">
        <div className="mb-8 sm:mb-10">
          <h2
            className="sr-only"
            id="benefits-heading"
          >
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {section.items.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "reveal-up text-center lg:text-left",
                index === 1 && "reveal-up-delay-1",
                index === 2 && "reveal-up-delay-2",
                index >= 3 && "reveal-up-delay-3",
              )}
            >
              <BenefitIcon className="mx-auto mb-3 lg:mx-0" name={item.icon} />
              <h3 className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-foreground sm:text-sm">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
