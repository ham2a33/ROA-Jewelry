import type { Metadata } from "next";
import { CartPage } from "@/components/store/cart/CartPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Корзина",
  noIndex: true,
});

export default function CartRoutePage() {
  return <CartPage />;
}
