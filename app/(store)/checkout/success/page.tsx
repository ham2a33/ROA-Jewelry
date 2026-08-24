import { Container } from "@/components/ui/Container";
import { StoreButton } from "@/components/ui/StoreButton";
import { siteConfig } from "@/lib/config/site-config";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Заказ принят",
  noIndex: true,
});

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order?.trim();

  return (
    <Container
      as="div"
      className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center sm:py-24"
    >
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        ROA Jewelry
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] tracking-[0.02em] text-foreground">
        Заказ принят
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        Ваш заказ сформирован. Мы открыли WhatsApp менеджера, чтобы подтвердить
        детали и согласовать доставку.
      </p>
      {orderNumber ? (
        <p className="mt-6 font-sans text-sm font-medium text-foreground">
          Номер заказа: #{orderNumber}
        </p>
      ) : null}
      <StoreButton className="mt-8" href={siteConfig.routes.catalog}>
        Вернуться в каталог
      </StoreButton>
    </Container>
  );
}
