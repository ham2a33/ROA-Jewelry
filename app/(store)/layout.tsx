import type { Metadata } from "next";
import { CartProvider } from "@/components/store/cart/CartProvider";
import { FavoritesProvider } from "@/components/store/favorites/FavoritesProvider";
import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header/Header";
import { getResolvedSiteSettings } from "@/server/queries/admin/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResolvedSiteSettings();

  if (!settings.faviconUrl) {
    return {};
  }

  return {
    icons: {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
    },
  };
}

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getResolvedSiteSettings();

  return (
    <FavoritesProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header logoUrl={settings.logoUrl} siteName={settings.siteName} />
          <main className="flex-1">{children}</main>
          <Footer logoUrl={settings.logoUrl} siteName={settings.siteName} />
        </div>
      </CartProvider>
    </FavoritesProvider>
  );
}
