import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";
import { siteConfig } from "@/lib/config/site-config";

export const metadata: Metadata = createInfoMetadata(
  "Политика конфиденциальности",
  "Как ROA Jewelry обрабатывает персональные данные.",
);

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Политика конфиденциальности">
      <p>
        Настоящая политика описывает, как {siteConfig.name} собирает, использует
        и защищает персональные данные пользователей сайта.
      </p>
      <h2 className="mt-8 font-serif text-xl tracking-[0.02em] text-foreground">
        Какие данные мы собираем
      </h2>
      <p>
        При оформлении заказа мы можем запрашивать имя, номер телефона, адрес
        доставки и адрес электронной почты — только для обработки заказа и
        связи с вами.
      </p>
      <h2 className="mt-8 font-serif text-xl tracking-[0.02em] text-foreground">
        Как мы используем данные
      </h2>
      <p>
        Данные используются исключительно для выполнения заказов, доставки,
        обратной связи и улучшения сервиса. Мы не передаём данные третьим
        лицам без вашего согласия, за исключением случаев, предусмотренных
        законом.
      </p>
    </InfoPageLayout>
  );
}
