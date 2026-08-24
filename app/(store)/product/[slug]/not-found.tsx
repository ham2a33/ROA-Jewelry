import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/config/site-config";

export default function ProductNotFound() {
  return (
    <Container as="div" className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[0.02em] text-foreground">
        Товар не найден
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        Возможно, товар был снят с продажи или ссылка устарела.
      </p>
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md border border-foreground/10 bg-foreground px-6 py-2.5 text-sm font-medium tracking-[0.04em] text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={siteConfig.routes.catalog}
      >
        Вернуться в каталог
      </Link>
    </Container>
  );
}
