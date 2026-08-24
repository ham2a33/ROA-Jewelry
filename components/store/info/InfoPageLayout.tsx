import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/seo/metadata";

type InfoPageLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function InfoPageLayout({
  title,
  description,
  children,
}: InfoPageLayoutProps) {
  return (
    <Container as="div" className="py-10 sm:py-14 lg:py-16">
      <header className="max-w-3xl border-b border-border/60 pb-8 sm:pb-10">
        <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          ROA Jewelry
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.08] tracking-[0.02em] text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="prose-roa mt-8 max-w-3xl text-sm leading-[1.8] text-foreground/85 sm:text-[0.9375rem]">
        {children}
      </div>
    </Container>
  );
}

export function createInfoMetadata(title: string, description: string) {
  return createPageMetadata({ title, description });
}
