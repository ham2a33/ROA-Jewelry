import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { Logo } from "@/components/layout/header/Logo";
import {
  FooterColumn,
  FooterLinkList,
} from "@/components/layout/footer/FooterColumn";
import { NewsletterForm } from "@/components/layout/footer/NewsletterForm";
import {
  footerCatalogNavigation,
  footerInfoNavigation,
  footerLegalNavigation,
} from "@/lib/config/navigation";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";

function SocialLinks({ className }: { className?: string }) {
  const links = [
    {
      label: "Instagram",
      href: siteConfig.social.instagram,
      icon: InstagramIcon,
    },
    {
      label: "Telegram",
      href: siteConfig.social.telegram,
      icon: TelegramIcon,
    },
    {
      label: "WhatsApp",
      href: siteConfig.social.whatsapp,
      icon: WhatsAppIcon,
    },
  ].filter((item) => item.href.length > 0);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/35 text-foreground/75 transition-colors duration-200 hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

function ContactList() {
  const items = [
    siteConfig.contact.phone
      ? {
          key: "phone",
          label: "Телефон",
          href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
          text: siteConfig.contact.phone,
        }
      : null,
    siteConfig.contact.whatsappUrl
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          href: siteConfig.contact.whatsappUrl,
          text: "WhatsApp",
        }
      : null,
    siteConfig.contact.instagramUrl || siteConfig.contact.instagramHandle
      ? {
          key: "instagram",
          label: "Instagram",
          href:
            siteConfig.contact.instagramUrl ||
            `https://instagram.com/${siteConfig.contact.instagramHandle.replace(/^@/, "")}`,
          text:
            siteConfig.contact.instagramHandle ||
            siteConfig.contact.instagramUrl,
        }
      : null,
    siteConfig.contact.address
      ? {
          key: "address",
          label: "Адрес",
          href: undefined,
          text: siteConfig.contact.address,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    href?: string;
    text: string;
  }>;

  if (items.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-foreground/60">
        Контактные данные будут опубликованы в настройках сайта.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key} className="flex items-start gap-2.5 text-sm text-foreground/75">
          {item.key === "phone" ? (
            <Phone
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-foreground/45"
              strokeWidth={1.5}
            />
          ) : null}
          {item.href ? (
            <a
              className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
              href={item.href}
              rel={item.key === "instagram" || item.key === "whatsapp" ? "noopener noreferrer" : undefined}
              target={item.key === "instagram" || item.key === "whatsapp" ? "_blank" : undefined}
            >
              {item.text}
            </a>
          ) : (
            <span>{item.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

type FooterProps = {
  logoUrl?: string | null;
  siteName?: string;
};

export function Footer({ logoUrl, siteName }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border/60 bg-footer text-foreground">
      <Container as="div" className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="space-y-5 sm:col-span-2 lg:col-span-3">
            <Logo logoUrl={logoUrl} siteName={siteName} />
            <p className="max-w-xs text-sm leading-relaxed text-foreground/70">
              {siteConfig.footer.tagline}
            </p>
            <SocialLinks />
          </div>

          <FooterColumn className="lg:col-span-2" title="Каталог">
            <FooterLinkList items={footerCatalogNavigation} />
          </FooterColumn>

          <FooterColumn className="lg:col-span-2" title="Информация">
            <FooterLinkList items={footerInfoNavigation} />
          </FooterColumn>

          <FooterColumn className="lg:col-span-2" title="Контакты">
            <ContactList />
          </FooterColumn>

          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-2 font-serif text-xl tracking-[0.02em] text-foreground">
              Будьте в курсе
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-foreground/70">
              Получайте новости, новинки и специальные предложения.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-border/50">
        <Container
          as="div"
          className="flex flex-col gap-4 py-6 text-sm text-foreground/65 md:flex-row md:items-center md:justify-between"
        >
          <p>
            © {siteConfig.footer.copyrightYear} {siteConfig.name}. Все права
            защищены.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            {footerLegalNavigation.map((item) => (
              <Link
                key={item.href}
                className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <span className="text-foreground/50">{siteConfig.footer.country}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
