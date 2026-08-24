"use client";

import { ProductQuantity } from "@/components/store/product/ProductQuantity";

type CartQuantityProps = {
  quantity: number;
  maxQuantity: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
};

export function CartQuantity({
  quantity,
  maxQuantity,
  disabled = false,
  onChange,
}: CartQuantityProps) {
  return (
    <ProductQuantity
      disabled={disabled}
      label=""
      maxQuantity={maxQuantity}
      onChange={onChange}
      quantity={quantity}
    />
  );
}
