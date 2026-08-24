import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CategoryCard } from "@/components/store/home/CategoryCard";
import { siteConfig } from "@/lib/config/site-config";
import type { HomepageCategory } from "@/types/category";

type CategoriesSectionProps = {
  categories: HomepageCategory[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="categories-heading" className="bg-background">
      <Container as="div" className="-mt-2 pb-14 pt-0 sm:pb-20 lg:-mt-4 lg:pb-24">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10 lg:mb-12">
          <h2
            className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[0.02em] text-foreground uppercase"
            id="categories-heading"
          >
            Категории
          </h2>
          <Link
            className="shrink-0 font-sans text-sm text-foreground/65 underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={siteConfig.routes.catalog}
          >
            Смотреть все →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-6">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
