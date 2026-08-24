import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductBreadcrumbs } from "@/components/store/product/ProductBreadcrumbs";
import { ProductDetailsList } from "@/components/store/product/ProductDetailsList";
import { ProductGallery } from "@/components/store/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/store/product/ProductPurchasePanel";
import { RelatedProductsSection } from "@/components/store/product/RelatedProductsSection";
import { siteConfig } from "@/lib/config/site-config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import { getProductBySlug } from "@/server/queries/product";
import { getRelatedProducts } from "@/server/queries/related-products";
import { resolveProductBadge } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: "Товар не найден",
      noIndex: true,
    });
  }

  const description =
    product.shortDescription ??
    product.description?.slice(0, 160) ??
    undefined;

  return createPageMetadata({
    title: product.name,
    description,
    canonicalPath: siteConfig.routes.product(product.slug),
    image: product.images[0]?.media ?? null,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category.id,
  );

  const badge = resolveProductBadge(product);
  const jsonLd = productJsonLd({
    name: product.name,
    slug: product.slug,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    price: product.price,
    imageUrls: product.images.map((image) => image.media.url),
    inStock: product.stock > 0,
  });

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        type="application/ld+json"
      />

      <Container as="div" className="py-8 sm:py-10 lg:py-14">
        <ProductBreadcrumbs product={product} />

        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)] lg:items-start lg:gap-14 xl:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {siteConfig.name}
            </p>

            <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] tracking-[0.02em] text-foreground">
              {product.name}
            </h1>

            {product.material ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {product.material}
              </p>
            ) : null}

            <div className="mt-8">
              <ProductPurchasePanel badge={badge} product={product} />
            </div>
          </div>
        </div>

        {product.description ? (
          <section
            aria-labelledby="product-description-heading"
            className="mt-16 max-w-3xl border-t border-border/50 pt-12 sm:mt-20"
          >
            <h2
              className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight tracking-[0.02em] text-foreground"
              id="product-description-heading"
            >
              Описание
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-[1.8] text-muted-foreground sm:text-[0.9375rem]">
              {product.description.split("\n").map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}

        <ProductDetailsList product={product} />
        <RelatedProductsSection products={relatedProducts} />
      </Container>
    </>
  );
}
