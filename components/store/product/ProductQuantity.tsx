"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ProductQuantityProps = {
  quantity: number;
  maxQuantity: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
  className?: string;
  label?: string;
};

export function ProductQuantity({
  quantity,
  maxQuantity,
  disabled = false,
  onChange,
  className,
  label = "Количество",
}: ProductQuantityProps) {
  const isDisabled = disabled || maxQuantity <= 0;
  const safeMax = Math.max(0, maxQuantity);
  const safeQuantity = Math.min(Math.max(quantity, 1), safeMax || 1);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <span className="block font-sans text-xs font-medium tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div className="inline-flex items-center">
        <button
          aria-label="Уменьшить количество"
          className="inline-flex h-11 w-11 items-center justify-center border border-border/70 bg-surface-elevated text-foreground transition-colors duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isDisabled || safeQuantity <= 1}
          onClick={() => onChange(Math.max(1, safeQuantity - 1))}
          type="button"
        >
          <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <output
          aria-live="polite"
          className="flex h-11 min-w-12 items-center justify-center border-y border-border/70 bg-surface-elevated px-4 text-sm font-medium text-foreground"
        >
          {safeQuantity}
        </output>

        <button
          aria-label="Увеличить количество"
          className="inline-flex h-11 w-11 items-center justify-center border border-border/70 bg-surface-elevated text-foreground transition-colors duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isDisabled || safeQuantity >= safeMax}
          onClick={() => onChange(Math.min(safeMax, safeQuantity + 1))}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
