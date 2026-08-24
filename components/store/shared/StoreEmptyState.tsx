import { StoreButton } from "@/components/ui/StoreButton";
import { cn } from "@/lib/utils/cn";

type StoreEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
};

export function StoreEmptyState({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: StoreEmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-lg px-4 py-16 text-center sm:py-20",
        className,
      )}
    >
      {eyebrow ? (
        <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] tracking-[0.02em] text-foreground",
          eyebrow ? "mt-4" : "mt-0",
        )}
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        {description}
      </p>
      <StoreButton className="mt-8 w-full sm:w-auto" href={ctaHref}>
        {ctaLabel}
      </StoreButton>
    </div>
  );
}
