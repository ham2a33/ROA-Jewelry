import { CoverImage } from "@/components/ui/CoverImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site-config";
import { formatPrice } from "@/lib/utils/format-price";
import { formatDateTime } from "@/lib/utils/format-date";
import { buildCustomerWhatsAppUrl } from "@/lib/utils/whatsapp";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import {
  CopyOrderNumber,
  OrderStatusSelect,
} from "@/components/admin/orders/OrderStatusSelect";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminOrderById } from "@/server/queries/admin/orders";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await requirePermission("orders.manage");
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const whatsappMessage = `Здравствуйте, ${order.customerName}!\n\nПо вашему заказу ${order.orderNumber} хотели уточнить детали...`;
  const whatsappUrl = buildCustomerWhatsAppUrl(order.phone, whatsappMessage);

  return (
    <div>
      <AdminPageHeader
        title={`Заказ ${order.orderNumber}`}
        breadcrumbs={[
          { label: "Orders", href: siteConfig.routes.admin.orders },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <CopyOrderNumber orderNumber={order.orderNumber} />
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <AdminButton variant="secondary">Открыть WhatsApp</AdminButton>
              </a>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard title="Информация о заказе">
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-neutral-500">Статус</dt>
              <dd className="mt-1">
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Дата</dt>
              <dd className="mt-1">{formatDateTime(order.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Клиент</dt>
              <dd className="mt-1">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Телефон</dt>
              <dd className="mt-1">
                <a href={`tel:${order.phone}`} className="hover:underline">
                  {order.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Город</dt>
              <dd className="mt-1">{order.shippingCity ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Получение</dt>
              <dd className="mt-1">{order.shippingNotes ?? "—"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-neutral-500">Адрес</dt>
              <dd className="mt-1">{order.shippingAddress ?? "—"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-neutral-500">Комментарий</dt>
              <dd className="mt-1">{order.notes ?? "—"}</dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard title="Итого">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </AdminCard>
      </div>

      <AdminCard title="Товары" className="mt-6">
        <ul className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="cover-image-frame relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                {item.imageUrl ? (
                  <CoverImage
                    alt={item.productName}
                    sizes="64px"
                    src={item.imageUrl}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.productName}</p>
                {item.variantName ? (
                  <p className="text-sm text-neutral-500">
                    Размер: {item.variantName}
                  </p>
                ) : null}
                <p className="text-sm text-neutral-600">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
                {item.productSlug && item.productActive ? (
                  <Link
                    href={`${siteConfig.routes.admin.products}/${item.productId}`}
                    className="mt-1 inline-block text-sm text-neutral-700 hover:underline"
                  >
                    Открыть товар
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-neutral-500">
                    Товар больше недоступен
                  </p>
                )}
              </div>
              <div className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
