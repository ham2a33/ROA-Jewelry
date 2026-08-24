import Link from "next/link";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatDate } from "@/lib/utils/format-date";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_STYLES,
  ADMIN_PAGE_SIZES,
} from "@/lib/admin/constants";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { AdminEmptyState } from "@/components/admin/ui/AdminPageHeader";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminOrders } from "@/server/queries/admin/orders";
import type { OrderStatus } from "@/generated/prisma/client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  await requirePermission("orders.manage");
  const params = await searchParams;

  const page = Number(params.page ?? "1");
  const limit = Number(params.limit ?? "20");
  const data = await getAdminOrders({
    page,
    limit: ADMIN_PAGE_SIZES.includes(limit as (typeof ADMIN_PAGE_SIZES)[number])
      ? limit
      : 20,
    search: params.search,
    status: params.status as OrderStatus | undefined,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    minAmount: params.minAmount,
    maxAmount: params.maxAmount,
  });

  return (
    <div>
      <AdminPageHeader title="Заказы" description="Управление заказами магазина" />

      <form className="mb-4 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:grid-cols-4">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Поиск: номер, имя, телефон"
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          <option value="">Все статусы</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dateFrom"
          defaultValue={params.dateFrom ?? ""}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="date"
            name="dateTo"
            defaultValue={params.dateTo ?? ""}
            className="h-9 flex-1 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <button
            type="submit"
            className="h-9 rounded-md bg-neutral-900 px-4 text-sm text-white"
          >
            Фильтр
          </button>
        </div>
      </form>

      {data.items.length === 0 ? (
        <AdminEmptyState title="Заказов пока нет." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Заказ</th>
                <th className="px-4 py-3 font-medium">Клиент</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Товары</th>
                <th className="px-4 py-3 font-medium">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.items.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.itemCount}</td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge
                      label={ORDER_STATUS_LABELS[order.status]}
                      className={ORDER_STATUS_STYLES[order.status]}
                    />
                  </td>
                  <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${siteConfig.routes.admin.orders}/${order.id}`}
                      className="text-neutral-700 hover:text-neutral-900"
                    >
                      Открыть
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
        basePath={siteConfig.routes.admin.orders}
        searchParams={params}
      />
    </div>
  );
}
