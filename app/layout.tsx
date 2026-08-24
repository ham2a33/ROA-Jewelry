import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/config/site-config";
import { createRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const heading = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.htmlLang}>
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
