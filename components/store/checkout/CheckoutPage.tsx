"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Container } from "@/components/ui/Container";
import { StoreButton } from "@/components/ui/StoreButton";
import { StoreEmptyState } from "@/components/store/shared/StoreEmptyState";
import { StorePageHeader } from "@/components/store/shared/StorePageHeader";
import { useCart } from "@/components/store/cart/CartProvider";
import {
  CheckoutFields,
  CheckoutFormError,
  CheckoutSubmitButton,
  checkoutFormSchema,
  type CheckoutFormInput,
} from "@/components/store/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/store/checkout/CheckoutSummary";
import {
  buildCheckoutWhatsAppUrl,
  CheckoutWhatsAppUrlError,
  openCheckoutWhatsAppUrl,
} from "@/lib/checkout/whatsapp-url";
import { clearCart } from "@/lib/cart/store";
import { fetchCheckoutPreview, submitCheckoutOrder } from "@/server/actions/checkout";
import { siteConfig } from "@/lib/config/site-config";
import type { CheckoutPreview } from "@/types/checkout";

const initialValues: CheckoutFormInput = {
  name: "",
  phone: "",
  city: "",
  deliveryMethod: "delivery",
  address: "",
  comment: "",
};

function CheckoutSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
      <div className="animate-pulse space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="h-11 rounded-md bg-muted" key={index} />
        ))}
      </div>
      <div className="animate-pulse space-y-4 border-t border-border/50 pt-8 lg:border-l lg:pl-10">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
      </div>
    </div>
  );
}

export function CheckoutPage({
  whatsappConfigured,
}: {
  whatsappConfigured: boolean;
}) {
  const router = useRouter();
  const { items } = useCart();
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [values, setValues] = useState<CheckoutFormInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutFormInput, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const cartKey = useMemo(
    () =>
      items
        .map((item) => `${item.productId}:${item.variantId ?? ""}:${item.quantity}`)
        .join("|"),
    [items],
  );
  const loadedCartKey = useMemo(() => {
    if (!preview) {
      return "";
    }

    return preview.lines
      .map((line) => `${line.productId}:${line.variantId ?? ""}:${line.quantity}`)
      .join("|");
  }, [preview]);
  const needsFetch = items.length > 0 && cartKey !== loadedCartKey;

  useEffect(() => {
    if (!needsFetch) {
      return;
    }

    let cancelled = false;

    startTransition(() => {
      void fetchCheckoutPreview(items)
        .then((nextPreview) => {
          if (!cancelled) {
            setPreview(nextPreview);
          }
        })
        .catch((error) => {
          console.error("[CheckoutPage]", error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [cartKey, items, needsFetch]);

  const updateField = <K extends keyof CheckoutFormInput>(
    key: K,
    value: CheckoutFormInput[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || !preview?.isValid) {
      return;
    }

    const parsed = checkoutFormSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof CheckoutFormInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field as keyof CheckoutFormInput]) {
          nextErrors[field as keyof CheckoutFormInput] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const result = await submitCheckoutOrder({
        cartItems: items,
        form: parsed.data,
      });

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      const whatsappUrl = buildCheckoutWhatsAppUrl(
        result.data.whatsappNumber,
        result.data.message,
      );

      clearCart();
      const openedInNewTab = openCheckoutWhatsAppUrl(whatsappUrl);

      if (openedInNewTab) {
        router.push(
          `${siteConfig.routes.checkoutSuccess}?order=${encodeURIComponent(result.data.orderNumber)}`,
        );
      }
    } catch (error) {
      console.error("[CheckoutPage]", error);
      if (error instanceof CheckoutWhatsAppUrlError) {
        setFormError(error.message);
        return;
      }

      setFormError("Не удалось оформить заказ. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container as="div" className="py-8 sm:py-10 lg:py-14">
        <StorePageHeader title="Оформление заказа" />
        <StoreEmptyState
          ctaHref={siteConfig.routes.catalog}
          ctaLabel="Перейти в каталог"
          description="Добавьте украшения в корзину, чтобы оформить заказ."
          title="Ваша корзина пуста"
        />
      </Container>
    );
  }

  const showCartIssue = preview?.hasUnavailableItems || preview?.isValid === false;
  const formDisabled = showCartIssue || !whatsappConfigured;

  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-14">
      <StorePageHeader
        description="Заполните данные — менеджер свяжется с вами для подтверждения."
        title="Оформление заказа"
      />

      {!whatsappConfigured ? (
        <CheckoutFormError message="Оформление через WhatsApp временно недоступно. Свяжитесь с нами позже." />
      ) : null}

      {showCartIssue ? (
        <div className="mb-8 border-b border-border/50 pb-6">
          <p className="text-sm text-foreground">
            Некоторые товары требуют обновления.
          </p>
          <StoreButton
            className="mt-4"
            href={siteConfig.routes.cart}
            variant="secondary"
          >
            Вернуться в корзину
          </StoreButton>
        </div>
      ) : null}

      {!preview && needsFetch && isPending ? <CheckoutSkeleton /> : null}

      {preview && items.length > 0 ? (
        <form
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:gap-14"
          onSubmit={handleSubmit}
        >
          <section aria-labelledby="checkout-recipient-heading">
            <h2
              className="mb-6 font-serif text-xl tracking-[0.02em] text-foreground"
              id="checkout-recipient-heading"
            >
              Данные получателя
            </h2>
            <CheckoutFields
              disabled={formDisabled || isSubmitting}
              errors={fieldErrors}
              onChange={updateField}
              values={values}
            />
            {formError ? (
              <div className="mt-5">
                <CheckoutFormError
                  message={formError}
                  showCartLink={formError.includes("корзину")}
                />
              </div>
            ) : null}
            <div className="mt-6 lg:hidden">
              <CheckoutSubmitButton
                disabled={formDisabled}
                isSubmitting={isSubmitting}
              />
            </div>
          </section>

          <div className="space-y-6">
            <CheckoutSummary lines={preview.lines} subtotal={preview.subtotal} />
            <CheckoutSubmitButton
              className="hidden lg:inline-flex"
              disabled={formDisabled}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      ) : null}
    </Container>
  );
}
