import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatDateTime } from "@/lib/utils/format-date";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/admin/constants";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminCustomerByPhone } from "@/server/queries/admin/customers";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  await requirePermission("customers.manage");
  const { id } = await params;
  const customer = await getAdminCustomerByPhone(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title={customer.name}
        breadcrumbs={[
          { label: "Customers", href: siteConfig.routes.admin.customers },
          { label: customer.name },
        ]}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <AdminCard>
          <p className="text-xs text-neutral-500">Телефон</p>
          <p className="mt-1 font-medium">{customer.phone}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs text-neutral-500">Всего заказов</p>
          <p className="mt-1 font-medium">{customer.orderCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs text-neutral-500">Всего покупок</p>
          <p className="mt-1 font-medium">{formatPrice(customer.totalSpent)}</p>
        </AdminCard>
      </div>

      <AdminCard title="Заказы">
        <ul className="divide-y divide-neutral-100">
          {customer.orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <div>
                <Link
                  href={`${siteConfig.routes.admin.orders}/${order.id}`}
                  className="font-medium hover:underline"
                >
                  {order.orderNumber}
                </Link>
                <p className="text-neutral-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p>{formatPrice(Number(order.total))}</p>
                <AdminStatusBadge
                  label={ORDER_STATUS_LABELS[order.status]}
                  className={ORDER_STATUS_STYLES[order.status]}
                />
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
