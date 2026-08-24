"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { buildCatalogUrl } from "@/lib/catalog/url";
import { cn } from "@/lib/utils/cn";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("search") ?? "").trim();
    onClose();
    router.push(
      query ? buildCatalogUrl({ search: query }) : buildCatalogUrl(),
    );
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "overflow-hidden border-t border-border/60 bg-card/95 transition-[max-height,opacity] duration-300 ease-out",
        open ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
      )}
      id="header-search-panel"
    >
      <form
        className="px-4 py-3 sm:px-6 lg:px-8"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3">
          <label className="sr-only" htmlFor="header-search-input">
            Поиск украшений
          </label>
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              autoComplete="off"
              className="h-11 w-full rounded-md border border-border bg-background/80 pr-11 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
              id="header-search-input"
              name="search"
              placeholder="Поиск украшений..."
              type="search"
            />
          </div>
          <button
            aria-label="Закрыть поиск"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </form>
    </div>
  );
}
