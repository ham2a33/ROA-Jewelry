import type { Metadata } from "next";
import { FavoritesPage } from "@/components/store/favorites/FavoritesPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Избранное",
  noIndex: true,
});

export default function FavoritesRoutePage() {
  return <FavoritesPage />;
}
