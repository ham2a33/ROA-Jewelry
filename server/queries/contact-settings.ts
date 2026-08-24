import "server-only";

import {
  isWhatsAppConfigured,
  type WhatsAppContactSettings,
} from "@/lib/utils/whatsapp";
import { getResolvedSiteSettings } from "@/server/queries/admin/settings";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export async function getWhatsAppContactSettings(): Promise<WhatsAppContactSettings> {
  await requireRuntimeAccess();
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
  await requireRuntimeAccess();
  const contact = await getWhatsAppContactSettings();
  return isWhatsAppConfigured(contact);
}
