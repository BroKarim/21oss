import { ActivityBuilder } from "@/components/web/toolbox/activity/builder";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const title = "GitHub Activity Graph Generator";
const description = "Generate GitHub activity graph UI previews from profile or repository URLs, then customize theme, palette, and component style.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} · ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/toolbox/activity`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "GitHub activity graph generator by 21OSS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function ActivityPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background/50 [scrollbar-gutter:stable_both-edges]">
      <ActivityBuilder />
    </div>
  );
}
