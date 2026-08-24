import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site-config";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminCategoryById } from "@/server/queries/admin/categories";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCategoryEditPage({ params }: PageProps) {
  await requirePermission("categories.manage");
  const { id } = await params;
  const category = await getAdminCategoryById(id);
  if (!category) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title={category.name}
        breadcrumbs={[
          { label: "Categories", href: siteConfig.routes.admin.categories },
          { label: category.name },
        ]}
      />
      <CategoryForm
        mode="edit"
        initialImage={
          category.image
            ? {
                id: category.image.id,
                url: category.image.url,
                filename: category.image.filename,
                originalName: category.image.originalName,
                mimeType: category.image.mimeType,
                size: category.image.size,
                alt: category.image.alt,
              }
            : null
        }
        initialValues={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          sortOrder: category.sortOrder,
          isActive: category.isActive,
          seoTitle: category.seoTitle ?? "",
          seoDescription: category.seoDescription ?? "",
        }}
      />
    </div>
  );
}
