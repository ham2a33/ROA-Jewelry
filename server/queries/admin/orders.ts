import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export type AdminOrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
};

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  itemCount: number;
};

export type AdminOrdersResult = {
  items: AdminOrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function buildWhere(query: AdminOrdersQuery): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) {
      where.createdAt.gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      const end = new Date(query.dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (query.minAmount || query.maxAmount) {
    where.total = {};
    if (query.minAmount) {
      where.total.gte = query.minAmount;
    }
    if (query.maxAmount) {
      where.total.lte = query.maxAmount;
    }
  }

  return where;
}

export async function getAdminOrders(
  query: AdminOrdersQuery,
): Promise<AdminOrdersResult> {
  await requireRuntimeAccess();
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? DEFAULT_ADMIN_PAGE_SIZE;
  const where = buildWhere(query);
  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        phone: true,
        total: true,
        status: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
  ]);

  return {
    items: rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      customerName: row.customerName,
      phone: row.phone,
      total: Number(row.total),
      status: row.status,
      createdAt: row.createdAt,
      itemCount: row._count.items,
    })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  email: string;
  shippingCity: string | null;
  shippingAddress: string | null;
  shippingNotes: string | null;
  notes: string | null;
  adminNotes: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    sku: string;
    price: number;
    quantity: number;
    variantName: string | null;
    productSlug: string | null;
    productActive: boolean | null;
    imageUrl: string | null;
  }>;
};

export async function getAdminOrderById(
  id: string,
): Promise<AdminOrderDetail | null> {
  await requireRuntimeAccess();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              isActive: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                include: { media: { select: { url: true } } },
              },
            },
          },
          variant: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    shippingCity: order.shippingCity,
    shippingAddress: order.shippingAddress,
    shippingNotes: order.shippingNotes,
    notes: order.notes,
    adminNotes: order.adminNotes,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discount: Number(order.discount),
    total: Number(order.total),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      price: Number(item.price),
      quantity: item.quantity,
      variantName: item.variant?.name ?? null,
      productSlug: item.product?.slug ?? null,
      productActive: item.product?.isActive ?? null,
      imageUrl: item.product?.images[0]?.media.url ?? null,
    })),
  };
}

export async function getAdminOrderByNumber(
  orderNumber: string,
): Promise<AdminOrderDetail | null> {
  await requireRuntimeAccess();
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true },
  });
  if (!order) {
    return null;
  }
  return getAdminOrderById(order.id);
}
