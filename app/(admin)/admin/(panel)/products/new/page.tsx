import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminCategoriesForSelect } from "@/server/queries/admin/products";

export default async function AdminProductNewPage() {
  await requirePermission("products.manage");
  const categories = await getAdminCategoriesForSelect();

  return (
    <div>
      <AdminPageHeader title="Новый товар" />
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
