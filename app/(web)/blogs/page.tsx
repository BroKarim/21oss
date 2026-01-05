import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import WidgetBanner from "@/components/web/ui/banner";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
import ScrollToSlug from "@/components/web/scroll-to-slug";
import Link from "next/link";
import CuratedCard from "@/components/web/curated-card";

export const metadata: Metadata = {
  title: "Curated Open-Source Alternatives",
  description: "Curated lists of the best open-source tools and alternatives, handpicked to help developers, makers, and marketers choose the right stack.",
  openGraph: {
    title: "Curated Open-Source Alternatives · 21OSS",
    description: "Explore curated lists of the best open-source tools and alternatives for developers, makers, and marketers.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Curated Open-Source Alternatives by 21OSS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Open-Source Alternatives · 21OSS",
    description: "Handpicked open-source alternatives to popular tools and services.",
    images: [siteConfig.ogImage],
  },
};


export default async function Page() {
  const curatedLists = await getCuratedLists();

  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <ScrollToSlug />
      <div className="container py-4 space-y-6 ">
        <WidgetBanner />
        <AdBanner />
        <section id="curated-lists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedLists.map((list) => (
              <Link key={list.id} href={`/blogs/${list.url}`} className="block h-full">
                <CuratedCard title={list.title} description={list.description ?? ""} previewTools={list.tools.map((t) => t.name)} totalToolCount={list._count?.tools ?? 0} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
