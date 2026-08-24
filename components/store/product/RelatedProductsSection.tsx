import { ProductCard } from "@/components/store/product/ProductCard";
import type { ProductCardData } from "@/types/product";

type RelatedProductsSectionProps = {
  products: ProductCardData[];
};

export function RelatedProductsSection({
  products,
}: RelatedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-heading"
      className="mt-16 border-t border-border/50 pt-12 sm:mt-20 sm:pt-16"
    >
      <h2
        className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[0.02em] text-foreground"
        id="related-products-heading"
      >
        Вам также понравится
      </h2>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
