"use server";

import { prisma } from "@/lib/db";
import {
  isWhatsAppConfigured,
  parseStoredWhatsAppNumber,
} from "@/lib/utils/whatsapp";
import {
  checkoutSubmissionSchema,
  deliveryMethodLabels,
} from "@/lib/validations/checkout";
import { buildCheckoutWhatsAppMessage } from "@/lib/checkout/whatsapp-message";
import { getWhatsAppContactSettings } from "@/server/queries/contact-settings";
import {
  buildCheckoutPreview,
  generateOrderNumber,
} from "@/server/queries/checkout";
import type { CartItem } from "@/types/cart";
import type {
  CheckoutOrderResult,
  CheckoutPreview,
} from "@/types/checkout";

export async function fetchCheckoutPreview(
  cartItems: CartItem[],
): Promise<CheckoutPreview> {
  return buildCheckoutPreview(cartItems);
}

type SubmitCheckoutResult =
  | { success: true; data: CheckoutOrderResult }
  | {
      success: false;
      code: "validation" | "cart" | "whatsapp" | "server";
      message: string;
    };

export async function submitCheckoutOrder(
  input: unknown,
): Promise<SubmitCheckoutResult> {
  const parsed = checkoutSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      code: "validation",
      message: "Проверьте корректность данных формы.",
    };
  }

  const whatsappContact = await getWhatsAppContactSettings();

  if (!isWhatsAppConfigured(whatsappContact)) {
    return {
      success: false,
      code: "whatsapp",
      message: "WhatsApp менеджера временно недоступен.",
    };
  }

  const cartItems: CartItem[] = parsed.data.cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    variantId: item.variantId ?? null,
  }));

  const preview = await buildCheckoutPreview(cartItems);

  if (!preview.isValid || preview.lines.length === 0) {
    return {
      success: false,
      code: "cart",
      message:
        "Некоторые товары больше недоступны или их количество изменилось. Вернитесь в корзину и обновите заказ.",
    };
  }

  const orderNumber = await generateOrderNumber();
  const form = parsed.data.form;
  const subtotal = preview.subtotal;
  const total = subtotal;
  const deliveryLabel = deliveryMethodLabels[form.deliveryMethod];
  const shippingNotes = `Способ получения: ${deliveryLabel}`;
  const normalizedPhone = form.phone.trim();
  const placeholderEmail = `order+${orderNumber.toLowerCase()}@checkout.roa.local`;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          email: placeholderEmail,
          phone: normalizedPhone,
          customerName: form.name.trim(),
          shippingCity: form.city.trim(),
          shippingAddress:
            form.deliveryMethod === "delivery"
              ? form.address?.trim() || null
              : null,
          shippingNotes,
          subtotal,
          shippingCost: 0,
          discount: 0,
          total,
          notes: form.comment?.trim() || null,
          items: {
            create: preview.lines.map((line) => ({
              productId: line.productId,
              variantId: line.variantId,
              productName: line.variantName
                ? `${line.productName} — ${line.variantName}`
                : line.productName,
              sku: line.sku,
              price: line.unitPrice,
              quantity: line.quantity,
            })),
          },
        },
        select: {
          id: true,
          orderNumber: true,
          total: true,
        },
      });

      return createdOrder;
    });

    const message = buildCheckoutWhatsAppMessage({
      lines: preview.lines,
      total: Number(order.total),
      form,
    });

    const whatsappNumber = parseStoredWhatsAppNumber(
      whatsappContact.whatsappNumber,
    );

    if (!whatsappNumber || whatsappNumber.length < 10) {
      throw new Error("WhatsApp number is not configured");
    }

    if (!message.trim()) {
      throw new Error("WhatsApp message is empty");
    }

    return {
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        whatsappNumber,
        message,
        total: Number(order.total),
      },
    };
  } catch (error) {
    console.error("[submitCheckoutOrder]", error);
    return {
      success: false,
      code: "server",
      message: "Не удалось оформить заказ. Попробуйте ещё раз.",
    };
  }
}
