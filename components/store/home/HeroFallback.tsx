import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";

type HeroFallbackProps = {
  className?: string;
};

export function HeroFallback({ className }: HeroFallbackProps) {
  return (
    <section
      aria-label="Главная фотосекция"
      className={cn("bg-background", className)}
    >
      <Container as="div" className="pt-5 pb-1 sm:pt-7 sm:pb-2 lg:pt-8 lg:pb-3">
        <div className="flex h-[12rem] items-center justify-center rounded-xl border border-border/50 bg-muted/40 sm:h-[15rem] sm:rounded-2xl lg:h-[20rem]">
          <div className="hero-fade-up text-center">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {siteConfig.name}
            </p>
            <h1 className="mt-3 font-serif text-2xl tracking-[0.02em] text-foreground sm:text-3xl">
              {siteConfig.name}
            </h1>
          </div>
        </div>
      </Container>
    </section>
  );
}
