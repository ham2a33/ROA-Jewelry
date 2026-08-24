import { siteConfig } from "@/lib/config/site-config";

export function CatalogHero() {
  return (
    <header className="border-b border-border/60 pb-8 sm:pb-10">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
        {siteConfig.catalog.overline}
      </p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] tracking-[0.02em] text-foreground uppercase">
        {siteConfig.catalog.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        {siteConfig.catalog.description}
      </p>
    </header>
  );
}
