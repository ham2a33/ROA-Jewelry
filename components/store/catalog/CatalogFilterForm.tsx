import { siteConfig } from "@/lib/config/site-config";
import { getCatalogHiddenFields } from "@/lib/catalog/url";
import type { CatalogCategory, CatalogSearchParams } from "@/types/catalog";

type CatalogFilterFormProps = {
  params: CatalogSearchParams;
  categories: CatalogCategory[];
  idPrefix?: string;
};

export function CatalogFilterForm({
  params,
  categories,
  idPrefix = "catalog",
}: CatalogFilterFormProps) {
  const hiddenFields = getCatalogHiddenFields(params, [
    "page",
    "limit",
    "category",
    "minPrice",
    "maxPrice",
    "stock",
  ]);

  return (
    <form
      action={siteConfig.routes.catalog}
      className="space-y-6"
      method="GET"
    >
      {hiddenFields.map((field) => (
        <input key={field.name} name={field.name} type="hidden" value={field.value} />
      ))}

      <fieldset className="space-y-3">
        <legend className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Категория
        </legend>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              className="h-4 w-4 border-border text-foreground focus-visible:ring-accent/40"
              defaultChecked={!params.category}
              name="category"
              type="radio"
              value=""
            />
            Все категории
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
            >
              <input
                className="h-4 w-4 border-border text-foreground focus-visible:ring-accent/40"
                defaultChecked={params.category === category.slug}
                name="category"
                type="radio"
                value={category.slug}
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Цена
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="sr-only"
              htmlFor={`${idPrefix}-min-price`}
            >
              Цена от
            </label>
            <input
              className="min-h-11 w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              defaultValue={params.minPrice ?? ""}
              id={`${idPrefix}-min-price`}
              inputMode="numeric"
              min={0}
              name="minPrice"
              placeholder="От"
              type="number"
            />
          </div>
          <div>
            <label
              className="sr-only"
              htmlFor={`${idPrefix}-max-price`}
            >
              Цена до
            </label>
            <input
              className="min-h-11 w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              defaultValue={params.maxPrice ?? ""}
              id={`${idPrefix}-max-price`}
              inputMode="numeric"
              min={0}
              name="maxPrice"
              placeholder="До"
              type="number"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="sr-only">Наличие</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <input
            className="h-4 w-4 rounded border-border text-foreground focus-visible:ring-accent/40"
            defaultChecked={params.stock === "in"}
            name="stock"
            type="checkbox"
            value="in"
          />
          Только в наличии
        </label>
      </fieldset>

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-foreground/10 bg-foreground px-4 py-2.5 text-sm font-medium tracking-[0.04em] text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        type="submit"
      >
        Применить фильтры
      </button>
    </form>
  );
}
