"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertPermission, requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { orderStatusSchema } from "@/lib/validations/schemas";
import { z } from "zod";

type ActionResult =
  | { success: true }
  | { success: false; message: string };

export async function updateOrderStatus(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("orders.manage");

  const schema = z.object({
    orderId: z.string().min(1),
    status: orderStatusSchema,
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Некорректные данные." };
  }

  assertPermission(user, "orders.manage");

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { id: true, orderNumber: true },
  });

  if (!order) {
    return { success: false, message: "Заказ не найден." };
  }

  await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
  });

  revalidatePath(siteConfig.routes.admin.orders);
  revalidatePath(`${siteConfig.routes.admin.orders}/${parsed.data.orderId}`);
  revalidatePath(siteConfig.routes.admin.dashboard);

  return { success: true };
}

export async function updateOrderAdminNotes(input: unknown): Promise<ActionResult> {
  const user = await requirePermission("orders.manage");
  assertPermission(user, "orders.manage");

  if (
    typeof input !== "object" ||
    input === null ||
    !("orderId" in input)
  ) {
    return { success: false, message: "Некорректные данные." };
  }

  const payload = input as { orderId: string; adminNotes?: string };
  const orderId = String(payload.orderId);
  const adminNotes =
    typeof payload.adminNotes === "string" ? payload.adminNotes : "";

  await prisma.order.update({
    where: { id: orderId },
    data: { adminNotes },
  });

  revalidatePath(`${siteConfig.routes.admin.orders}/${orderId}`);
  return { success: true };
}
