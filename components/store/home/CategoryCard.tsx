import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { buildCategoryUrl } from "@/lib/catalog/url";
import { cn } from "@/lib/utils/cn";
import type { HomepageCategory } from "@/types/category";

type CategoryCardProps = {
  category: HomepageCategory;
  className?: string;
};

function resolveImageAlt(category: HomepageCategory): string {
  const alt = category.image?.alt?.trim();
  return alt && alt.length > 0 ? alt : category.name;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const href = buildCategoryUrl(category.slug);

  return (
    <Link
      className={cn(
        "group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      href={href}
    >
      <article className="relative aspect-square overflow-hidden rounded-xl bg-muted sm:rounded-2xl">
        {category.image ? (
          <CoverImage
            alt={resolveImageAlt(category)}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            src={category.image.url}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent transition-opacity duration-500 group-hover:from-foreground/65"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-white sm:text-[0.8125rem]">
            {category.name}
          </h3>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/20">
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </article>
    </Link>
  );
}
