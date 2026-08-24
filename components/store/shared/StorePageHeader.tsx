import { cn } from "@/lib/utils/cn";

type StorePageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
};

export function StorePageHeader({
  title,
  eyebrow = "ROA Jewelry",
  description,
  className,
}: StorePageHeaderProps) {
  return (
    <header className={cn("mb-8 sm:mb-10 lg:mb-12", className)}>
      {eyebrow ? (
        <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.06] tracking-[0.02em] text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
