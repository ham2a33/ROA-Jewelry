"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/header/Logo";
import { mobileNavigation } from "@/lib/config/navigation";
import { useBodyScrollLock } from "@/lib/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils/cn";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  logoUrl?: string | null;
  siteName?: string;
};

export function MobileMenu({ open, onClose, logoUrl, siteName }: MobileMenuProps) {
  useBodyScrollLock(open);

  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300 ease-out lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <div
        aria-hidden={!open}
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100%,320px)] flex-col border-r border-border bg-card shadow-none transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        id="mobile-menu"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Logo logoUrl={logoUrl} siteName={siteName} />
          <button
            aria-label="Закрыть меню"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <nav
          aria-label="Мобильная навигация"
          className="flex-1 overflow-y-auto px-5 py-6"
        >
          <ul className="space-y-1">
            {mobileNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="block rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  href={item.href}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
