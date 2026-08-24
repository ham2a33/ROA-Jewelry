import "server-only";

import { prisma } from "@/lib/db";
import {
  LOW_STOCK_THRESHOLD,
  REVENUE_STATUSES,
} from "@/lib/admin/constants";
import type { OrderStatus } from "@/generated/prisma/client";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(date: Date): Date {
  const copy = startOfDay(date);
  const day = copy.getDay();
  const diff = day === 0 ? 6 : day - 1;
  copy.setDate(copy.getDate() - diff);
  return copy;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

async function sumRevenue(where: {
  createdAt?: { gte?: Date };
  status?: { in: OrderStatus[] };
}): Promise<number> {
  const result = await prisma.order.aggregate({
    where: {
      status: { in: REVENUE_STATUSES },
      ...where,
    },
    _sum: { total: true },
  });

  return Number(result._sum.total ?? 0);
}

export type DashboardData = {
  metrics: {
    orders: {
      total: number;
      today: number;
      week: number;
      month: number;
    };
    revenue: {
      today: number;
      week: number;
      month: number;
    };
    products: {
      total: number;
      active: number;
      inactive: number;
      outOfStock: number;
    };
    customers: number;
  };
  notifications: {
    newOrders: number;
    outOfStock: number;
    lowStock: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    itemCount: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    slug: string;
  }>;
};

export async function getDashboardData(): Promise<DashboardData> {
  await requireRuntimeAccess();
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const [
    ordersTotal,
    ordersToday,
    ordersWeek,
    ordersMonth,
    revenueToday,
    revenueWeek,
    revenueMonth,
    productsTotal,
    productsActive,
    productsInactive,
    productsOutOfStock,
    customersCount,
    newOrdersCount,
    lowStockCount,
    outOfStockCount,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    sumRevenue({ createdAt: { gte: todayStart } }),
    sumRevenue({ createdAt: { gte: weekStart } }),
    sumRevenue({ createdAt: { gte: monthStart } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.product.count({ where: { stock: 0, isActive: true } }),
    prisma.order.groupBy({
      by: ["phone"],
      _count: { phone: true },
    }).then((rows) => rows.length),
    prisma.order.count({
      where: { status: "PENDING", createdAt: { gte: weekStart } },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: { gt: 0, lte: LOW_STOCK_THRESHOLD },
      },
    }),
    prisma.product.count({ where: { isActive: true, stock: 0 } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: LOW_STOCK_THRESHOLD },
      },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      take: 8,
      select: { id: true, name: true, stock: true, slug: true },
    }),
  ]);

  return {
    metrics: {
      orders: {
        total: ordersTotal,
        today: ordersToday,
        week: ordersWeek,
        month: ordersMonth,
      },
      revenue: {
        today: revenueToday,
        week: revenueWeek,
        month: revenueMonth,
      },
      products: {
        total: productsTotal,
        active: productsActive,
        inactive: productsInactive,
        outOfStock: productsOutOfStock,
      },
      customers: customersCount,
    },
    notifications: {
      newOrders: newOrdersCount,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
    },
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt,
      itemCount: order._count.items,
    })),
    lowStockProducts,
  };
}
