import { formatPrice } from "@/lib/utils/format-price";
import type { CheckoutFormInput } from "@/lib/validations/checkout";
import type { CheckoutOrderLine } from "@/types/checkout";

function formatProductLine(line: CheckoutOrderLine, index: number): string {
  const title = line.variantName
    ? `${line.productName} — ${line.variantName}`
    : line.productName;

  return `${index + 1}. ${title} — ${formatPrice(line.unitPrice)} × ${line.quantity} = ${formatPrice(line.lineTotal)}`;
}

function buildCustomerBlock(form: CheckoutFormInput): string {
  return [`Имя: ${form.name.trim()}`, `Телефон: ${form.phone.trim()}`].join("\n");
}

function buildDeliveryBlock(form: CheckoutFormInput): string {
  if (form.deliveryMethod === "pickup") {
    return "Получение: Самовывоз";
  }

  const lines = ["Доставка:", `Город: ${form.city.trim()}`];

  if (form.address?.trim()) {
    lines.push(`Адрес: ${form.address.trim()}`);
  }

  return lines.join("\n");
}

function buildCommentBlock(form: CheckoutFormInput): string {
  if (!form.comment?.trim()) {
    return "";
  }

  return `\n\nКомментарий:\n${form.comment.trim()}`;
}

export function buildCheckoutWhatsAppMessage(input: {
  lines: CheckoutOrderLine[];
  total: number;
  form: CheckoutFormInput;
}): string {
  const itemsBlock = input.lines.map(formatProductLine).join("\n");

  return `Здравствуйте! Хочу оформить заказ.

Товары:
${itemsBlock}

Итого: ${formatPrice(input.total)}

Данные клиента:
${buildCustomerBlock(input.form)}

${buildDeliveryBlock(input.form)}${buildCommentBlock(input.form)}

Спасибо!`;
}
