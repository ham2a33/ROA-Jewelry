import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";

export const metadata: Metadata = createInfoMetadata(
  "Возврат",
  "Условия возврата и обмена украшений ROA Jewelry.",
);

export default function ReturnsPage() {
  return (
    <InfoPageLayout
      description="Мы заботимся о вашем комфорте — возврат возможен в течение 14 дней."
      title="Возврат и обмен"
    >
      <p>
        Вы можете вернуть или обменять изделие в течение 14 дней с момента
        получения, если оно не было в употреблении и сохранены все бирки и
        фирменная упаковка.
      </p>
      <p>
        Для оформления возврата свяжитесь с нами через WhatsApp или по
        телефону — мы подскажем дальнейшие шаги и поможем с оформлением.
      </p>
    </InfoPageLayout>
  );
}
