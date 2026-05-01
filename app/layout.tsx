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
import { Toaster } from "@/components/ui/sonner";
import { Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { env } from "@/env";

export const metadata: Metadata = {
  title: {
    default: "21OSS: Curated Open-Source Templates, Components, Tools & Assets",
    template: `%s · ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL("https://21oss.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
  },
  category: "technology",
  keywords: ["open source templates", "ui components library", "frontend resources", "developer tools", "icons library", "ship faster", "nextjs ui components", "tailwind templates"],

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
    title: "21OSS: Curated Open-Source Templates, Components, Tools & Assets",
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
  twitter: {
    card: "summary_large_image",
    creator: "@brokariim",
    title: "21OSS: Curated Open-Source Templates, Components, Tools & Assets",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${bricolage.className} `, " [scrollbar-gutter:stable]")}>
        <div className="h-full">
          <NuqsAdapter>
            <SearchProvider>
              <AppProviders adminSidebar={<AdminSidebar />}>
                <div className=" h-full w-full">
                  {children}
                  <Toaster />
                  <Search />
                </div>
              </AppProviders>
            </SearchProvider>
          </NuqsAdapter>
        </div>
        <Analytics />
        <SpeedInsights />
        {env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script 
            defer 
            src="https://cloud.umami.is/script.js" 
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} 
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
