import type { Metadata } from "next";
import { CheckoutPage } from "@/components/store/checkout/CheckoutPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isCheckoutWhatsAppAvailable } from "@/server/queries/contact-settings";

export const metadata: Metadata = createPageMetadata({
  title: "Оформление заказа",
  noIndex: true,
});

export default async function CheckoutRoutePage() {
  const whatsappConfigured = await isCheckoutWhatsAppAvailable();

  return <CheckoutPage whatsappConfigured={whatsappConfigured} />;
}
