import { normalizeWhatsAppPhoneNumber } from "@/lib/utils/whatsapp";

export class CheckoutWhatsAppUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutWhatsAppUrlError";
  }
}

/**
 * Builds a wa.me URL from a digits-only number and plain-text message.
 * Message is encoded exactly once via encodeURIComponent.
 */
export function buildCheckoutWhatsAppUrl(
  whatsappNumber: string,
  message: string,
): string {
  const digits = normalizeWhatsAppPhoneNumber(whatsappNumber);
  const trimmedMessage = message.trim();

  if (!digits || digits.length < 10) {
    throw new CheckoutWhatsAppUrlError(
      "Некорректный номер WhatsApp для оформления заказа.",
    );
  }

  if (!trimmedMessage) {
    throw new CheckoutWhatsAppUrlError("Сообщение заказа пустое.");
  }

  const encodedMessage = encodeURIComponent(trimmedMessage);
  const whatsappUrl = `https://wa.me/${digits}?text=${encodedMessage}`;

  if (!whatsappUrl.includes(`wa.me/${digits}?text=`)) {
    throw new CheckoutWhatsAppUrlError("Не удалось сформировать WhatsApp URL.");
  }

  if (!encodedMessage) {
    throw new CheckoutWhatsAppUrlError("Текст сообщения не закодирован.");
  }

  return whatsappUrl;
}

export function openCheckoutWhatsAppUrl(whatsappUrl: string): boolean {
  const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = whatsappUrl;
    return false;
  }

  return true;
}
