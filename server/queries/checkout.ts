import "server-only";

import { prisma } from "@/lib/db";
import { toMediaRef } from "@/server/queries/mappers";
import type { CartItem } from "@/types/cart";
import type { CheckoutOrderLine, CheckoutPreview } from "@/types/checkout";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

type ProductImageRecord = {
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  media: MediaRecord;
};

const checkoutProductSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  material: true,
  isActive: true,
  category: {
    select: {
      name: true,
    },
  },
  images: {
    select: {
      alt: true,
      isPrimary: true,
      sortOrder: true,
      media: {
        select: {
          id: true,
          url: true,
          alt: true,
          width: true,
          height: true,
          mimeType: true,
        },
      },
    },
  },
  variants: {
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      isActive: true,
    },
  },
} as const;

function pickPrimaryImage(images: ProductImageRecord[]) {
  const sorted = [...images].sort((left, right) => {
    if (left.isPrimary !== right.isPrimary) {
      return left.isPrimary ? -1 : 1;
    }

    return left.sortOrder - right.sortOrder;
  });

  const primary = sorted[0];
  if (!primary) {
    return null;
  }

  const mediaRef = toMediaRef(primary.media);
  if (!mediaRef) {
    return null;
  }

  const alt = primary.alt?.trim();
  return alt ? { ...mediaRef, alt } : mediaRef;
}

type CheckoutProductRecord = {
  id: string;
  name: string;
  sku: string;
  price: { toString(): string };
  stock: number;
  isActive: boolean;
  images: ProductImageRecord[];
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: { toString(): string } | null;
    stock: number;
    isActive: boolean;
  }>;
};

function resolveCheckoutLine(
  item: CartItem,
  product: CheckoutProductRecord | undefined,
): CheckoutOrderLine | null {
  if (!product || !product.isActive) {
    return null;
  }

  const variantKey = item.variantId ?? null;
  const variant = variantKey
    ? product.variants.find((entry) => entry.id === variantKey) ?? null
    : null;

  if (variantKey && (!variant || !variant.isActive)) {
    return null;
  }

  const availableStock = variant?.stock ?? product.stock;
  if (availableStock <= 0 || item.quantity > availableStock) {
    return null;
  }

  const unitPrice = variant?.price?.toString() ?? product.price.toString();
  const priceNumber = Number(unitPrice);

  return {
    productId: product.id,
    variantId: variant?.id ?? null,
    productName: product.name,
    variantName: variant?.name ?? null,
    sku: variant?.sku ?? product.sku,
    quantity: item.quantity,
    unitPrice,
    lineTotal: Number.isFinite(priceNumber) ? priceNumber * item.quantity : 0,
    image: pickPrimaryImage(product.images),
  };
}

export async function buildCheckoutPreview(
  cartItems: CartItem[],
): Promise<CheckoutPreview> {
  if (cartItems.length === 0) {
    return {
      lines: [],
      subtotal: 0,
      isValid: false,
      hasUnavailableItems: false,
    };
  }

  const productIds = [...new Set(cartItems.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: checkoutProductSelect,
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines: CheckoutOrderLine[] = [];

  for (const item of cartItems) {
    const line = resolveCheckoutLine(item, productMap.get(item.productId));
    if (line) {
      lines.push(line);
    }
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return {
    lines,
    subtotal,
    isValid: lines.length === cartItems.length && lines.length > 0,
    hasUnavailableItems: lines.length !== cartItems.length,
  };
}

export async function generateOrderNumber(): Promise<string> {
  const latestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  const latestSequence = latestOrder?.orderNumber.match(/(\d+)$/)?.[1];
  const nextSequence = latestSequence ? Number(latestSequence) + 1 : 1;

  return `ROA-${String(nextSequence).padStart(4, "0")}`;
}

export { checkoutProductSelect };
