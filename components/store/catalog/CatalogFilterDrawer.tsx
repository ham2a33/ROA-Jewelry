"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CatalogFilterForm } from "@/components/store/catalog/CatalogFilterForm";
import { cn } from "@/lib/utils/cn";
import type { CatalogCategory, CatalogSearchParams } from "@/types/catalog";

type CatalogFilterDrawerProps = {
  params: CatalogSearchParams;
  categories: CatalogCategory[];
};

export function CatalogFilterDrawer({
  params,
  categories,
}: CatalogFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDrawer, open]);

  return (
    <>
      <button
        aria-controls={drawerId}
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        Фильтры
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Закрыть фильтры"
            className="absolute inset-0 bg-foreground/20"
            onClick={closeDrawer}
            type="button"
          />

          <div
            aria-labelledby={`${drawerId}-title`}
            aria-modal="true"
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl border border-border/80 bg-background p-5 shadow-none"
            id={drawerId}
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2
                className="font-serif text-xl tracking-[0.02em] text-foreground"
                id={`${drawerId}-title`}
              >
                Фильтры
              </h2>
              <button
                ref={closeButtonRef}
                aria-label="Закрыть"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-card text-foreground transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
                onClick={closeDrawer}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <CatalogFilterForm
              categories={categories}
              idPrefix={`${drawerId}-filter`}
              params={params}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
