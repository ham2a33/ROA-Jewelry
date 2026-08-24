import Link from "next/link";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatDate } from "@/lib/utils/format-date";
import {
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin/ui/AdminPageHeader";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminCustomers } from "@/server/queries/admin/customers";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  await requirePermission("customers.manage");
  const params = await searchParams;
  const data = await getAdminCustomers({
    page: Number(params.page ?? "1"),
    limit: Number(params.limit ?? "20"),
    search: params.search,
  });

  return (
    <div>
      <AdminPageHeader title="Customers" />
      <form className="mb-4">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Поиск по имени или телефону"
          className="h-9 w-full max-w-md rounded-md border border-neutral-200 px-3 text-sm"
        />
      </form>

      {data.items.length === 0 ? (
        <AdminEmptyState title="Клиентов пока нет." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Город</th>
                <th className="px-4 py-3">Заказы</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Последний заказ</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((customer) => (
                <tr key={customer.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`${siteConfig.routes.admin.customers}/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.city ?? "—"}</td>
                  <td className="px-4 py-3">{customer.orderCount}</td>
                  <td className="px-4 py-3">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-4 py-3">
                    {customer.lastOrderAt
                      ? formatDate(customer.lastOrderAt)
                      : "—"}
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
        basePath={siteConfig.routes.admin.customers}
        searchParams={params}
      />
    </div>
  );
}
