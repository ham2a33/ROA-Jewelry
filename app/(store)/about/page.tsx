import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";
import { siteConfig } from "@/lib/config/site-config";

export const metadata: Metadata = createInfoMetadata(
  "О нас",
  "История бренда ROA Jewelry, философия и ценности.",
);

export default function AboutPage() {
  return (
    <InfoPageLayout
      description="Премиальные ювелирные украшения из серебра 925 пробы с вниманием к деталям и эстетике."
      title="О нас"
    >
      <p>
        {siteConfig.name} — бренд ювелирных украшений, созданный для тех, кто
        ценит сдержанную роскошь, чистые линии и безупречное качество.
      </p>
      <p>
        Мы работаем с серебром 925 пробы, создавая коллекции для неё и для
        него — от минималистичных колец до выразительных кулонов и браслетов.
      </p>
      <p>
        Каждое изделие проходит контроль качества и упаковывается в фирменную
        подарочную упаковку — готовое решение для особого момента.
      </p>
    </InfoPageLayout>
  );
}
