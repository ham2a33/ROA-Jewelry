"use client";

import { MessageCircle } from "lucide-react";
import {
  StoreFieldHint,
  StoreInput,
  StoreLabel,
  StoreSelect,
  StoreTextarea,
} from "@/components/ui/StoreField";
import { StoreButton } from "@/components/ui/StoreButton";
import {
  deliveryMethodLabels,
  type CheckoutFormInput,
} from "@/lib/validations/checkout";
import { siteConfig } from "@/lib/config/site-config";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type CheckoutFieldsProps = {
  values: CheckoutFormInput;
  errors: Partial<Record<keyof CheckoutFormInput, string>>;
  disabled?: boolean;
  onChange: <K extends keyof CheckoutFormInput>(
    key: K,
    value: CheckoutFormInput[K],
  ) => void;
};

export function CheckoutFields({
  values,
  errors,
  disabled = false,
  onChange,
}: CheckoutFieldsProps) {
  return (
    <div className="space-y-5">
      <div>
        <StoreLabel htmlFor="checkout-name">Имя</StoreLabel>
        <StoreInput
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          disabled={disabled}
          id="checkout-name"
          name="name"
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Ваше имя"
          type="text"
          value={values.name}
        />
        {errors.name ? <StoreFieldHint>{errors.name}</StoreFieldHint> : null}
      </div>

      <div>
        <StoreLabel htmlFor="checkout-phone">Телефон</StoreLabel>
        <StoreInput
          aria-invalid={Boolean(errors.phone)}
          autoComplete="tel"
          disabled={disabled}
          id="checkout-phone"
          inputMode="tel"
          name="phone"
          onChange={(event) => onChange("phone", event.target.value)}
          placeholder="+7 (___) ___-__-__"
          type="tel"
          value={values.phone}
        />
        {errors.phone ? <StoreFieldHint>{errors.phone}</StoreFieldHint> : null}
      </div>

      <div>
        <StoreLabel htmlFor="checkout-city">Город</StoreLabel>
        <StoreInput
          aria-invalid={Boolean(errors.city)}
          autoComplete="address-level2"
          disabled={disabled}
          id="checkout-city"
          name="city"
          onChange={(event) => onChange("city", event.target.value)}
          placeholder="Алматы"
          type="text"
          value={values.city}
        />
        {errors.city ? <StoreFieldHint>{errors.city}</StoreFieldHint> : null}
      </div>

      <div>
        <StoreLabel htmlFor="checkout-delivery-method">
          Способ получения
        </StoreLabel>
        <StoreSelect
          disabled={disabled}
          id="checkout-delivery-method"
          name="deliveryMethod"
          onChange={(event) =>
            onChange(
              "deliveryMethod",
              event.target.value as CheckoutFormInput["deliveryMethod"],
            )
          }
          value={values.deliveryMethod}
        >
          <option value="delivery">{deliveryMethodLabels.delivery}</option>
          <option value="pickup">{deliveryMethodLabels.pickup}</option>
        </StoreSelect>
      </div>

      {values.deliveryMethod === "delivery" ? (
        <div>
          <StoreLabel htmlFor="checkout-address">Адрес</StoreLabel>
          <StoreTextarea
            aria-invalid={Boolean(errors.address)}
            autoComplete="street-address"
            disabled={disabled}
            id="checkout-address"
            name="address"
            onChange={(event) => onChange("address", event.target.value)}
            placeholder="Улица, дом, квартира"
            value={values.address ?? ""}
          />
          {errors.address ? (
            <StoreFieldHint>{errors.address}</StoreFieldHint>
          ) : null}
        </div>
      ) : null}

      <div>
        <StoreLabel htmlFor="checkout-comment">Комментарий</StoreLabel>
        <StoreTextarea
          disabled={disabled}
          id="checkout-comment"
          name="comment"
          onChange={(event) => onChange("comment", event.target.value)}
          placeholder="Дополнительный комментарий к заказу"
          value={values.comment ?? ""}
        />
      </div>
    </div>
  );
}

type CheckoutSubmitButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
};

export function CheckoutSubmitButton({
  disabled = false,
  isSubmitting = false,
  className,
}: CheckoutSubmitButtonProps) {
  return (
    <StoreButton
      className={cn("gap-2", className)}
      disabled={disabled || isSubmitting}
      fullWidth
      type="submit"
    >
      <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
      {isSubmitting ? "Открываем WhatsApp..." : "Заказать в WhatsApp"}
    </StoreButton>
  );
}

export function CheckoutFormError({
  message,
  showCartLink = false,
}: {
  message: string;
  showCartLink?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground">
      <p>{message}</p>
      {showCartLink ? (
        <Link
          className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
          href={siteConfig.routes.cart}
        >
          Вернуться в корзину
        </Link>
      ) : null}
    </div>
  );
}

export {
  checkoutFormSchema,
  deliveryMethodLabels,
  type CheckoutFormInput,
} from "@/lib/validations/checkout";
