import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export type AdminCustomerListItem = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date | null;
};

export async function getAdminCustomers(query?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  await requireRuntimeAccess();
  const page = Math.max(1, query?.page ?? 1);
  const limit = query?.limit ?? DEFAULT_ADMIN_PAGE_SIZE;
  const search = query?.search?.trim();

  const orders = await prisma.order.findMany({
    where: search
      ? {
          OR: [
            { customerName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      customerName: true,
      phone: true,
      shippingCity: true,
      total: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const grouped = new Map<
    string,
    {
      name: string;
      phone: string;
      city: string | null;
      orderCount: number;
      totalSpent: number;
      lastOrderAt: Date | null;
      orderIds: string[];
    }
  >();

  for (const order of orders) {
    const key = order.phone.trim();
    const existing = grouped.get(key);
    const total = Number(order.total);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += total;
      existing.orderIds.push(order.id);
      if (!existing.lastOrderAt || order.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt;
        existing.name = order.customerName;
        existing.city = order.shippingCity;
      }
    } else {
      grouped.set(key, {
        name: order.customerName,
        phone: order.phone,
        city: order.shippingCity,
        orderCount: 1,
        totalSpent: total,
        lastOrderAt: order.createdAt,
        orderIds: [order.id],
      });
    }
  }

  const allCustomers = Array.from(grouped.entries())
    .map(([phone, data]) => ({
      id: encodeURIComponent(phone),
      name: data.name,
      phone,
      city: data.city,
      orderCount: data.orderCount,
      totalSpent: data.totalSpent,
      lastOrderAt: data.lastOrderAt,
    }))
    .sort((a, b) => {
      const aTime = a.lastOrderAt?.getTime() ?? 0;
      const bTime = b.lastOrderAt?.getTime() ?? 0;
      return bTime - aTime;
    });

  const total = allCustomers.length;
  const skip = (page - 1) * limit;
  const items = allCustomers.slice(skip, skip + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminCustomerByPhone(encodedPhone: string) {
  await requireRuntimeAccess();
  const phone = decodeURIComponent(encodedPhone);
  const orders = await prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
      customerName: true,
      shippingCity: true,
    },
  });

  if (orders.length === 0) {
    return null;
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);

  const firstOrder = orders[0]!;

  return {
    name: firstOrder.customerName,
    phone,
    city: firstOrder.shippingCity,
    orderCount: orders.length,
    totalSpent,
    orders,
  };
}
