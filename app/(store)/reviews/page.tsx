import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";

export const metadata: Metadata = createInfoMetadata(
  "Отзывы",
  "Отзывы клиентов ROA Jewelry.",
);

export default function ReviewsPage() {
  return (
    <InfoPageLayout
      description="Нам доверяют более 1000 клиентов по всему Казахстану и СНГ."
      title="Отзывы"
    >
      <p>
        Мы ценим каждый отзыв — он помогает нам становиться лучше и создавать
        украшения, которые действительно носят с удовольствием.
      </p>
      <p>
        Отзывы клиентов публикуются после модерации. Если вы уже делали заказ,
        оставьте отзыв через WhatsApp или Instagram — мы с радостью добавим
        его на сайт.
      </p>
    </InfoPageLayout>
  );
}
