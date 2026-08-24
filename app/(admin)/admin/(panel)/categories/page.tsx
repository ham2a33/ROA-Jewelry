import Link from "next/link";
import { siteConfig } from "@/lib/config/site-config";
import {
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin/ui/AdminPageHeader";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminCategories } from "@/server/queries/admin/categories";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  await requirePermission("categories.manage");
  const params = await searchParams;
  const data = await getAdminCategories({
    page: Number(params.page ?? "1"),
    limit: Number(params.limit ?? "20"),
    search: params.search,
  });

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        actions={
          <Link href={`${siteConfig.routes.admin.categories}/new`}>
            <AdminButton>Добавить категорию</AdminButton>
          </Link>
        }
      />

      <form className="mb-4">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Поиск"
          className="h-9 w-full max-w-md rounded-md border border-neutral-200 px-3 text-sm"
        />
      </form>

      {data.items.length === 0 ? (
        <AdminEmptyState title="Категорий пока нет." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((category) => (
                <tr key={category.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3">{category.slug}</td>
                  <td className="px-4 py-3">{category._count.products}</td>
                  <td className="px-4 py-3">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    {category.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${siteConfig.routes.admin.categories}/${category.id}`}
                      className="hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        basePath={siteConfig.routes.admin.categories}
        searchParams={params}
      />
    </div>
  );
}
