import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StoreButton } from "@/components/ui/StoreButton";
import { siteConfig } from "@/lib/config/site-config";

export default function StoreNotFound() {
  return (
    <Container as="div" className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {siteConfig.name}
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[0.02em] text-foreground">
        404
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        Страница не найдена. Возможно, она была перемещена или больше не
        существует.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <StoreButton href={siteConfig.routes.home} variant="primary">
          На главную
        </StoreButton>
        <StoreButton href={siteConfig.routes.catalog} variant="secondary">
          Каталог
        </StoreButton>
      </div>
      <Link
        className="mt-6 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={siteConfig.routes.contacts}
      >
        Связаться с нами
      </Link>
    </Container>
  );
}
