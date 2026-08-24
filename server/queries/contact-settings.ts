import "server-only";

import {
  isWhatsAppConfigured,
  type WhatsAppContactSettings,
} from "@/lib/utils/whatsapp";
import { getResolvedSiteSettings } from "@/server/queries/admin/settings";

export async function getWhatsAppContactSettings(): Promise<WhatsAppContactSettings> {
  try {
    const settings = await getResolvedSiteSettings();

    return {
      whatsappNumber: settings.whatsappUrl,
    };
  } catch (error) {
    console.error("[getWhatsAppContactSettings]", error);
    return {
      whatsappNumber: null,
    };
  }
}

export async function isCheckoutWhatsAppAvailable(): Promise<boolean> {
  const contact = await getWhatsAppContactSettings();
  return isWhatsAppConfigured(contact);
}
