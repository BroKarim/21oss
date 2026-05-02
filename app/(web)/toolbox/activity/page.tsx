import { ActivityBuilder } from "@/components/web/toolbox/activity/builder";
import { siteConfig } from "@/config/site";
import { getStackFilters } from "@/server/web/tools/actions";
import type { Metadata } from "next";
import { WebShell } from "../../_components/web-shell";

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

export default async function ActivityPage() {
  const stacks = await getStackFilters();

  return (
    <WebShell stacks={stacks}>
      <div className="min-h-screen bg-background/50">
        <ActivityBuilder />
      </div>
    </WebShell>
  );
}
