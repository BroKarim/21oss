import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadataConfig: Metadata = {
  openGraph: {
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: { url: `${siteConfig.url}/opengraph.png`, width: 1200, height: 630 },
  },
  twitter: {
    creator: "@brokariim",
    card: "summary_large_image",
  },
};
