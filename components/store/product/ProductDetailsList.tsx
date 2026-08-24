import type { ProductPageData } from "@/types/product-page";

type ProductDetailsListProps = {
  product: ProductPageData;
};

function formatWeight(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return `${value} г`;
  }

  return `${parsed.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
  })} г`;
}

export function ProductDetailsList({ product }: ProductDetailsListProps) {
  const details = [
    product.material ? { label: "Материал", value: product.material } : null,
    product.hallmark ? { label: "Проба", value: product.hallmark } : null,
    product.weightGrams
      ? { label: "Вес", value: formatWeight(product.weightGrams) }
      : null,
    product.sku ? { label: "Артикул", value: product.sku } : null,
    product.category.name
      ? { label: "Категория", value: product.category.name }
      : null,
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item?.value),
  );

  if (details.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="product-details-heading" className="mt-12 sm:mt-16">
      <h2
        className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight tracking-[0.02em] text-foreground"
        id="product-details-heading"
      >
        Детали
      </h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div className="border-b border-border/50 pb-4" key={item.label}>
            <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
