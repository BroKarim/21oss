import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SearchProvider } from "@/contexts/search-context";
import { cn } from "@/lib/utils";
import { AppProviders } from "./providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  authors: [
    {
      name: "brokariim",
      url: "https://21oss.com",
    },
  ],
  creator: "brokariim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(GeistSans.variable, GeistMono.variable, "font-sans [scrollbar-gutter:stable]")}>
        <div className="h-full">
          <NuqsAdapter>
            <SearchProvider>
              <AppProviders>
                {children}
              </AppProviders>
            </SearchProvider>
          </NuqsAdapter>
        </div>
      </body>
    </html>
  );
}
