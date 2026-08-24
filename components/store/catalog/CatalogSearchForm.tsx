import { siteConfig } from "@/lib/config/site-config";
import { getCatalogHiddenFields } from "@/lib/catalog/url";
import type { CatalogSearchParams } from "@/types/catalog";

type CatalogSearchFormProps = {
  params: CatalogSearchParams;
};

export function CatalogSearchForm({ params }: CatalogSearchFormProps) {
  const hiddenFields = getCatalogHiddenFields(params, ["page", "limit", "search"]);

  return (
    <form
      action={siteConfig.routes.catalog}
      className="flex min-w-0 flex-1 gap-2"
      method="GET"
      role="search"
    >
      {hiddenFields.map((field) => (
        <input key={field.name} name={field.name} type="hidden" value={field.value} />
      ))}

      <label className="sr-only" htmlFor="catalog-search">
        Поиск украшений
      </label>
      <input
        className="min-h-11 min-w-0 flex-1 rounded-md border border-border/80 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        defaultValue={params.search ?? ""}
        id="catalog-search"
        name="search"
        placeholder="Поиск украшений..."
        type="search"
      />
      <button
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-foreground/10 bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        type="submit"
      >
        Найти
      </button>
    </form>
  );
}
