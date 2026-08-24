import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";
import { siteConfig } from "@/lib/config/site-config";

export const metadata: Metadata = createInfoMetadata(
  "Публичная оферта",
  "Условия покупки ювелирных изделий ROA Jewelry.",
);

export default function OfferPage() {
  return (
    <InfoPageLayout title="Публичная оферта">
      <p>
        Настоящий документ является публичной офертой {siteConfig.name} и
        определяет условия приобретения товаров через интернет-магазин.
      </p>
      <h2 className="mt-8 font-serif text-xl tracking-[0.02em] text-foreground">
        Предмет оферты
      </h2>
      <p>
        Продавец обязуется передать покупателю ювелирные изделия, а покупатель
        обязуется оплатить и принять товар на условиях, указанных на сайте и в
        подтверждении заказа.
      </p>
      <h2 className="mt-8 font-serif text-xl tracking-[0.02em] text-foreground">
        Оформление заказа
      </h2>
      <p>
        Заказ считается принятым после подтверждения менеджером. Цены на сайте
        указаны в тенге и могут быть изменены до момента подтверждения заказа.
      </p>
    </InfoPageLayout>
  );
}
