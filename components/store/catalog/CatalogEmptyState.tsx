import Link from "next/link";
import { siteConfig } from "@/lib/config/site-config";

export function CatalogEmptyState() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 px-6 py-14 text-center sm:px-10 sm:py-16">
      <h2 className="font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[0.02em] text-foreground">
        Ничего не найдено
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        Попробуйте изменить параметры поиска или фильтров.
      </p>
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md border border-foreground/10 bg-foreground px-6 py-2.5 text-sm font-medium tracking-[0.04em] text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={siteConfig.routes.catalog}
      >
        Сбросить фильтры
      </Link>
    </div>
  );
}
