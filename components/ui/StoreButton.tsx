import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type StoreButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
};

const variants = {
  primary:
    "border border-accent/80 bg-accent text-accent-foreground hover:bg-accent/90",
  secondary:
    "border border-foreground/15 bg-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/[0.03]",
  ghost:
    "border border-transparent bg-transparent text-foreground/80 hover:text-foreground",
};

export function StoreButton({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  fullWidth,
}: StoreButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center px-7 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-12 sm:text-xs",
    fullWidth && "w-full",
    variants[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (disabled) {
      return (
        <span aria-disabled="true" className={classes}>
          {children}
        </span>
      );
    }
    if (isExternal) {
      return (
        <a
          className={classes}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
