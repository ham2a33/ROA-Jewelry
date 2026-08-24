import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { requirePermission } from "@/lib/auth/guards";

export default async function AdminCategoryNewPage() {
  await requirePermission("categories.manage");
  return (
    <div>
      <AdminPageHeader title="Новая категория" />
      <CategoryForm mode="create" />
    </div>
  );
}
