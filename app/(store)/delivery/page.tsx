import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";

export const metadata: Metadata = createInfoMetadata(
  "Доставка и оплата",
  "Условия доставки и способы оплаты заказов ROA Jewelry.",
);

export default function DeliveryPage() {
  return (
    <InfoPageLayout
      description="Доставляем по Казахстану и странам СНГ. Оплата при получении или онлайн."
      title="Доставка и оплата"
    >
      <h2 className="font-serif text-xl tracking-[0.02em] text-foreground">
        Доставка
      </h2>
      <p>
        Отправляем заказы курьерскими службами по Алматы, Астане и другим
        городам Казахстана. Международная доставка доступна в страны СНГ.
      </p>
      <p>
        Срок доставки зависит от региона и составляет от 1 до 7 рабочих дней.
        Точные сроки и стоимость уточняются при оформлении заказа.
      </p>
      <h2 className="mt-8 font-serif text-xl tracking-[0.02em] text-foreground">
        Оплата
      </h2>
      <p>
        Принимаем оплату картой онлайн, переводом или при получении — в
        зависимости от выбранного способа доставки. После оформления заказа
        менеджер свяжется с вами для подтверждения.
      </p>
    </InfoPageLayout>
  );
}
