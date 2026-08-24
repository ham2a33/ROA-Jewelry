import type { Metadata } from "next";
import {
  createInfoMetadata,
  InfoPageLayout,
} from "@/components/store/info/InfoPageLayout";
import { siteConfig } from "@/lib/config/site-config";

export const metadata: Metadata = createInfoMetadata(
  "Контакты",
  "Свяжитесь с ROA Jewelry — телефон, WhatsApp, Instagram.",
);

export default function ContactsPage() {
  const { phone, whatsappUrl, instagramHandle, instagramUrl, address } =
    siteConfig.contact;

  return (
    <InfoPageLayout
      description="Мы всегда на связи — поможем с выбором, размером и оформлением заказа."
      title="Контакты"
    >
      <ul className="space-y-4 not-prose">
        {phone ? (
          <li>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Телефон
            </span>
            <a
              className="mt-1 inline-block transition-colors hover:text-foreground/70"
              href={`tel:${phone.replace(/\s/g, "")}`}
            >
              {phone}
            </a>
          </li>
        ) : null}
        {whatsappUrl ? (
          <li>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              WhatsApp
            </span>
            <a
              className="mt-1 inline-block transition-colors hover:text-foreground/70"
              href={whatsappUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Написать в WhatsApp
            </a>
          </li>
        ) : null}
        {instagramHandle || instagramUrl ? (
          <li>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Instagram
            </span>
            <a
              className="mt-1 inline-block transition-colors hover:text-foreground/70"
              href={
                instagramUrl ||
                `https://instagram.com/${instagramHandle?.replace(/^@/, "")}`
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              {instagramHandle || instagramUrl}
            </a>
          </li>
        ) : null}
        {address ? (
          <li>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Адрес
            </span>
            <span className="mt-1 block">{address}</span>
          </li>
        ) : null}
      </ul>
    </InfoPageLayout>
  );
}
