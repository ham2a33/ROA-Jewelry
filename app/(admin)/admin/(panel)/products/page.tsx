import Link from "next/link";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatDate } from "@/lib/utils/format-date";
import { requirePermission } from "@/lib/auth/guards";
import {
  getAdminCategoriesForSelect,
  getAdminProducts,
} from "@/server/queries/admin/products";
import { CoverImage } from "@/components/ui/CoverImage";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requirePermission("products.manage");
  const params = await searchParams;
  const categories = await getAdminCategoriesForSelect();

  const data = await getAdminProducts({
    page: Number(params.page ?? "1"),
    limit: Number(params.limit ?? "20"),
    search: params.search,
    categoryId: params.categoryId,
    status: params.status as "active" | "inactive" | undefined,
    stock: params.stock as "in" | "out" | "low" | undefined,
    featured: params.featured as "true" | "false" | undefined,
    bestseller: params.bestseller as "true" | "false" | undefined,
  });

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Управление каталогом товаров"
        actions={
          <Link href={`${siteConfig.routes.admin.products}/new`}>
            <AdminButton>Добавить товар</AdminButton>
          </Link>
        }
      />

      <form className="mb-4 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 lg:grid-cols-4">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Поиск: название, SKU, slug"
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        />
        <select
          name="categoryId"
          defaultValue={params.categoryId ?? ""}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          <option value="">Все статусы</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-neutral-900 px-4 text-sm text-white"
        >
          Фильтр
        </button>
      </form>

      {data.items.length === 0 ? (
        <AdminEmptyState
          title="Товаров пока нет."
          action={
            <Link href={`${siteConfig.routes.admin.products}/new`}>
              <AdminButton>Добавить товар</AdminButton>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.items.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-neutral-100 cover-image-frame">
                      {product.imageUrl ? (
                        <CoverImage
                          alt={product.name}
                          sizes="40px"
                          src={product.imageUrl}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.categoryName}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-3">{formatDate(product.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${siteConfig.routes.admin.products}/${product.id}`}
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
        basePath={siteConfig.routes.admin.products}
        searchParams={params}
      />
    </div>
  );
}
