import { ProductCard } from "@/components/store/product/ProductCard";
import type { ProductCardData } from "@/types/product";

type CatalogProductGridProps = {
  products: ProductCardData[];
};

export function CatalogProductGrid({ products }: CatalogProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
