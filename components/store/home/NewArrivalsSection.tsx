import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/store/product/ProductCard";
import { siteConfig } from "@/lib/config/site-config";
import type { NewArrivalsSectionData } from "@/types/new-arrivals";

type NewArrivalsSectionProps = {
  section: NewArrivalsSectionData | null;
};

export function NewArrivalsSection({ section }: NewArrivalsSectionProps) {
  if (!section || section.products.length === 0) {
    return null;
  }

  const title = section.title ?? "Новинки";

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="border-t border-border/50 bg-card/30"
    >
      <Container as="div" className="py-14 sm:py-20 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10 lg:mb-12">
          <div className="min-w-0">
            <h2
              className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[0.02em] text-foreground uppercase"
              id="new-arrivals-heading"
            >
              {title}
            </h2>
            {section.subtitle ? (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {section.subtitle}
              </p>
            ) : null}
          </div>

          <Link
            className="shrink-0 font-sans text-sm text-foreground/65 underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={siteConfig.routes.catalog}
          >
            Смотреть все →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {section.products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
