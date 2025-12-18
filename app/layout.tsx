import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SearchProvider } from "@/contexts/search-context";
import { cn } from "@/lib/utils";
import { AppProviders } from "./providers";
import { siteConfig } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Search } from "@/components/ui/search";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL("https://21oss.com"),
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

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${geist.className} `, " [scrollbar-gutter:stable]")}>
        <div className="h-full">
          <NuqsAdapter>
            <SearchProvider>
              <AppProviders adminSidebar={<AdminSidebar />}>
                <div className=" h-full w-full">
                  {children}
                  <Search />
                </div>
              </AppProviders>
            </SearchProvider>
          </NuqsAdapter>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
