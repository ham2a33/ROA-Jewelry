import type { MediaRef } from "@/lib/media/types";
import type { CheckoutFormInput } from "@/lib/validations/checkout";

export type CheckoutOrderLine = {
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: number;
  image: MediaRef | null;
};

export type CheckoutPreview = {
  lines: CheckoutOrderLine[];
  subtotal: number;
  isValid: boolean;
  hasUnavailableItems: boolean;
};

export type CheckoutOrderResult = {
  orderId: string;
  orderNumber: string;
  whatsappNumber: string;
  message: string;
  total: number;
};

export type CheckoutFormValues = CheckoutFormInput;

export type CheckoutSuccessData = {
  orderNumber: string;
};
