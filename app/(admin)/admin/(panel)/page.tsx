import Link from "next/link";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatRelativeDay } from "@/lib/utils/format-date";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/admin/constants";
import { AdminMetricCard, AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { getDashboardData } from "@/server/queries/admin/dashboard";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Обзор магазина ROA Jewelry"
      />

      {data.notifications.newOrders > 0 ||
      data.notifications.lowStock > 0 ||
      data.notifications.outOfStock > 0 ? (
        <AdminCard title="Уведомления" className="mb-6">
          <ul className="space-y-2 text-sm text-neutral-700">
            {data.notifications.newOrders > 0 ? (
              <li>{data.notifications.newOrders} новых заказов</li>
            ) : null}
            {data.notifications.outOfStock > 0 ? (
              <li>{data.notifications.outOfStock} товаров закончились</li>
            ) : null}
            {data.notifications.lowStock > 0 ? (
              <li>{data.notifications.lowStock} товаров с низким stock</li>
            ) : null}
          </ul>
        </AdminCard>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Заказы"
          value={String(data.metrics.orders.total)}
          hint={`Сегодня: ${data.metrics.orders.today} · Неделя: ${data.metrics.orders.week}`}
        />
        <AdminMetricCard
          label="Выручка (месяц)"
          value={formatPrice(data.metrics.revenue.month)}
          hint={`Сегодня: ${formatPrice(data.metrics.revenue.today)}`}
        />
        <AdminMetricCard
          label="Товары"
          value={String(data.metrics.products.total)}
          hint={`Активные: ${data.metrics.products.active} · Нет в наличии: ${data.metrics.products.outOfStock}`}
        />
        <AdminMetricCard
          label="Клиенты"
          value={String(data.metrics.customers)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard
          title="Последние заказы"
          action={
            <Link
              href={siteConfig.routes.admin.orders}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Все заказы
            </Link>
          }
        >
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">Заказов пока нет.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <Link
                      href={`${siteConfig.routes.admin.orders}/${order.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm text-neutral-600">{order.customerName}</p>
                    <p className="text-xs text-neutral-500">
                      {formatRelativeDay(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                    <AdminStatusBadge
                      label={ORDER_STATUS_LABELS[order.status]}
                      className={ORDER_STATUS_STYLES[order.status]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard
          title="Низкий остаток"
          action={
            <Link href={siteConfig.routes.admin.products}>
              <AdminButton variant="secondary" size="sm">
                Посмотреть товары
              </AdminButton>
            </Link>
          }
        >
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-neutral-500">Все товары в наличии.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.lowStockProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <Link
                    href={`${siteConfig.routes.admin.products}/${product.id}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <span className="text-neutral-600">{product.stock} шт.</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
