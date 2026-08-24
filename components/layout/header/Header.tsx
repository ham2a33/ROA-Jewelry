"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DesktopNavigation } from "@/components/layout/header/DesktopNavigation";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { Logo } from "@/components/layout/header/Logo";
import { MobileMenu } from "@/components/layout/header/MobileMenu";
import { SearchPanel } from "@/components/layout/header/SearchPanel";
import { useEscapeKey } from "@/lib/hooks/use-escape-key";
import { cn } from "@/lib/utils/cn";

type HeaderProps = {
  logoUrl?: string | null;
  siteName?: string;
};

export function Header({ logoUrl, siteName }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEscapeKey(closeMenu, menuOpen);
  useEscapeKey(closeSearch, searchOpen);

  const toggleSearch = useCallback(() => {
    setSearchOpen((current) => !current);
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setSearchOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
        scrolled
          ? "border-b border-border/70 bg-background/95 backdrop-blur-md"
          : "border-b border-border/30 bg-background/90 backdrop-blur-sm",
      )}
    >
      <Container as="div" className="relative">
        <div className="flex h-16 items-center justify-between lg:hidden">
          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label="Открыть меню"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={openMenu}
            type="button"
          >
            <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <Logo centered className="absolute left-1/2 -translate-x-1/2" logoUrl={logoUrl} siteName={siteName} />

          <HeaderActions showFavorites={false} showSearch={false} />
        </div>

        <div className="hidden h-[4.75rem] items-center lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Logo logoUrl={logoUrl} siteName={siteName} />
          </div>

          <DesktopNavigation className="justify-self-center" />

          <HeaderActions
            className="justify-self-end"
            onSearchClick={toggleSearch}
            searchExpanded={searchOpen}
          />
        </div>
      </Container>

      <div className="hidden lg:block">
        <SearchPanel onClose={closeSearch} open={searchOpen} />
      </div>

      <MobileMenu logoUrl={logoUrl} onClose={closeMenu} open={menuOpen} siteName={siteName} />
    </header>
  );
}
