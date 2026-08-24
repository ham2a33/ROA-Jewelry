import { siteConfig } from "@/lib/config/site-config";

export type WhatsAppContactSettings = {
  /** Digits-only WhatsApp number from Admin → Settings → Social. */
  whatsappNumber?: string | null;
};

const staticFallbackContact: WhatsAppContactSettings = {
  whatsappNumber: siteConfig.contact.whatsappUrl || null,
};

/** Strip +, spaces, brackets, dashes and any other non-digits. */
export function normalizeWhatsAppPhoneNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Reads a stored WhatsApp value as digits only.
 * Legacy full URLs in the database are converted once on read.
 */
export function parseStoredWhatsAppNumber(
  stored: string | null | undefined,
): string | null {
  const trimmed = stored?.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.includes("wa.me")) {
    try {
      const url = new URL(trimmed);
      const phoneParam = url.searchParams.get("phone");
      if (phoneParam) {
        const paramDigits = normalizeWhatsAppPhoneNumber(phoneParam);
        if (paramDigits) {
          return paramDigits;
        }
      }

      const pathDigits = normalizeWhatsAppPhoneNumber(url.pathname);
      if (pathDigits) {
        return pathDigits;
      }
    } catch {
      // Fall through to digit extraction below.
    }
  }

  const digits = normalizeWhatsAppPhoneNumber(trimmed);
  return digits || null;
}

function resolveWhatsAppDigits(
  contact: WhatsAppContactSettings = staticFallbackContact,
): string | null {
  return parseStoredWhatsAppNumber(contact.whatsappNumber);
}

export function buildWhatsAppUrl(
  message: string,
  contact: WhatsAppContactSettings = staticFallbackContact,
): string | null {
  const digits = resolveWhatsAppDigits(contact);
  if (!digits || digits.length < 10) {
    return null;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppChatUrl(
  contact: WhatsAppContactSettings = staticFallbackContact,
): string | null {
  const digits = resolveWhatsAppDigits(contact);
  if (!digits || digits.length < 10) {
    return null;
  }

  return `https://wa.me/${digits}`;
}

export function buildProductWhatsAppUrl(
  productName: string,
  contact?: WhatsAppContactSettings,
): string | null {
  const message = `Здравствуйте! Интересует товар: ${productName}`;
  return buildWhatsAppUrl(message, contact);
}

export function buildWhatsAppOrderUrl(
  message: string,
  contact?: WhatsAppContactSettings,
): string | null {
  return buildWhatsAppUrl(message, contact);
}

export function isWhatsAppConfigured(
  contact: WhatsAppContactSettings = staticFallbackContact,
): boolean {
  const digits = resolveWhatsAppDigits(contact);
  return Boolean(digits && digits.length >= 10);
}

export function buildCustomerWhatsAppUrl(
  phone: string,
  message: string,
): string | null {
  const digits = normalizeWhatsAppPhoneNumber(phone);
  if (!digits || digits.length < 10) {
    return null;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
