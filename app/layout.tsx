import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site-config";
import { createRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.htmlLang}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
