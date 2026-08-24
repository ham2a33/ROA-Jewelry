import { CategoryCard } from "@/components/store/home/CategoryCard";
import type { CatalogCategory } from "@/types/catalog";

type CatalogCategoryGridProps = {
  categories: CatalogCategory[];
};

export function CatalogCategoryGrid({
  categories,
}: CatalogCategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Категории каталога" className="mt-8 sm:mt-10">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-6">
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
