import Link from "next/link";
import { buildCatalogUrl } from "@/lib/catalog/url";
import { siteConfig } from "@/lib/config/site-config";
import type { ProductPageData } from "@/types/product-page";

type ProductBreadcrumbsProps = {
  product: ProductPageData;
};

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-6 sm:mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <li>
          <Link
            className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={siteConfig.routes.home}
          >
            Главная
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={siteConfig.routes.catalog}
          >
            Каталог
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={buildCatalogUrl({ category: product.category.slug })}
          >
            {product.category.name}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" className="text-foreground">
            {product.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}
