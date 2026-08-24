import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждён",
  PAID: "Оплачен",
  PROCESSING: "В обработке",
  SHIPPED: "Отправлен",
  DELIVERED: "Завершён",
  CANCELLED: "Отменён",
  REFUNDED: "Возврат",
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
];

export const REVENUE_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 ring-blue-200",
  PAID: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  PROCESSING: "bg-violet-50 text-violet-800 ring-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  CANCELLED: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  REFUNDED: "bg-rose-50 text-rose-800 ring-rose-200",
};

export const LOW_STOCK_THRESHOLD = 5;

export const ADMIN_PAGE_SIZES = [20, 50, 100] as const;

export const DEFAULT_ADMIN_PAGE_SIZE = 20;
