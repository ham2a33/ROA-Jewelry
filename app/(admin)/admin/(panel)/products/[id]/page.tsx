import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site-config";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProductImagesSection } from "@/components/admin/products/ProductImagesSection";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductVariantsSection } from "@/components/admin/products/ProductVariantsSection";
import { requirePermission } from "@/lib/auth/guards";
import {
  getAdminCategoriesForSelect,
  getAdminProductById,
} from "@/server/queries/admin/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: PageProps) {
  await requirePermission("products.manage");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategoriesForSelect(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title={product.name}
        breadcrumbs={[
          { label: "Products", href: siteConfig.routes.admin.products },
          { label: product.name },
        ]}
      />
      <ProductForm
        mode="edit"
        categories={categories}
        initialValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          shortDescription: product.shortDescription ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice
            ? String(product.compareAtPrice)
            : "",
          sku: product.sku,
          stock: product.stock,
          material: product.material ?? "",
          hallmark: product.hallmark ?? "",
          weightGrams: product.weightGrams ? String(product.weightGrams) : "",
          categoryId: product.categoryId,
          isNew: product.isNew,
          isBestseller: product.isBestseller,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          seoTitle: product.seoTitle ?? "",
          seoDescription: product.seoDescription ?? "",
        }}
      />
      <div className="mt-6">
        <ProductImagesSection
          productId={product.id}
          initialImages={product.images.map((image) => ({
            mediaId: image.mediaId,
            url: image.media.url,
            filename: image.media.originalName,
            alt: image.alt ?? undefined,
            isPrimary: image.isPrimary,
            sortOrder: image.sortOrder,
          }))}
        />
      </div>
      <div className="mt-6">
        <ProductVariantsSection
          productId={product.id}
          variants={product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? String(variant.price) : "",
            stock: variant.stock,
            isActive: variant.isActive,
            image: variant.image
              ? {
                  id: variant.image.id,
                  url: variant.image.url,
                  filename: variant.image.filename,
                  originalName: variant.image.originalName,
                  mimeType: variant.image.mimeType,
                  size: variant.image.size,
                  alt: variant.image.alt,
                }
              : null,
          }))}
        />
      </div>
    </div>
  );
}
