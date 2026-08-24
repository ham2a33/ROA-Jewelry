import { cn } from "@/lib/utils/cn";
import { StoreButton } from "@/components/ui/StoreButton";

type HeroCtaProps = {
  text: string;
  url: string;
  className?: string;
  variant?: "primary" | "secondary";
};

export function HeroCta({
  text,
  url,
  className,
  variant = "primary",
}: HeroCtaProps) {
  const isInternal = url.startsWith("/");

  if (isInternal) {
    return (
      <StoreButton className={className} href={url} variant={variant}>
        {text}
      </StoreButton>
    );
  }

  return (
    <StoreButton className={className} href={url} variant={variant}>
      {text}
    </StoreButton>
  );
}

export function HeroCtaGroup({
  primary,
  secondary,
  className,
}: {
  primary?: { text: string; url: string };
  secondary?: { text: string; url: string };
  className?: string;
}) {
  if (!primary && !secondary) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {primary ? (
        <HeroCta text={primary.text} url={primary.url} variant="primary" />
      ) : null}
      {secondary ? (
        <HeroCta text={secondary.text} url={secondary.url} variant="secondary" />
      ) : null}
    </div>
  );
}
