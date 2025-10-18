import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import WidgetBanner from "@/components/web/ui/banner";
import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
import { getRecentTools } from "@/server/web/tools/actions";
import ScrollToSlug from "@/components/web/scroll-to-slug";
import { db } from "@/services/db";

export async function generateMetadata(props: { searchParams?: Promise<{ slug?: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const slug = searchParams?.slug;

  if (!slug) {
    return {
      title: "Awesome Tools — Curated Collections",
      description: "Discover open-source and startup-friendly tools curated by our community.",
    };
  }

  const curatedList = await db.curatedList.findUnique({
    where: { url: slug },
    select: { title: true, description: true },
  });

  if (!curatedList) {
    return {
      title: "Awesome Tools — Curated Collections",
      description: "Discover open-source and startup-friendly tools curated by our community.",
    };
  }

  return {
    title: curatedList.title,
    description: curatedList.description ?? "Explore this curated list of open source tools.",
    openGraph: {
      title: curatedList.title,
      description: curatedList.description ?? "Explore this curated list of open source tools.",
      images: [`/opengraph-image?slug=${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: curatedList.title,
      description: curatedList.description ?? "Explore this curated list of open source tools.",
      images: [`/opengraph-image?slug=${slug}`],
    },
  };
}

export default async function Page() {
  const curatedLists = await getCuratedLists();

  const sections = [
    {
      id: "recent",
      label: "Recently Added",
      type: "gallery" as const,
      tools: await getRecentTools(),
      options: {
        loadMore: true,
        showScroll: false,
        showViewAll: false,
      },
    },
    // Dynamic sections from curated lists
    ...curatedLists.map((curatedList) => ({
      id: curatedList.url,
      label: curatedList.title,
      description: curatedList.description ?? undefined,
      type: curatedList.type as "slider" | "favicon" | "gallery" | "carousel",
      tools: curatedList.tools,
      options: {
        showScroll: true,
        showViewAll: false,
        viewAllUrl: `/`,
        loadMore: true,
      },
    })),
  ];

  return (
    <main className={cn("flex flex-1 flex-col min-h-0 w-full max-w-full overflow-x-hidden")}>
      <ScrollToSlug />
      <div className="w-full max-w-full px-4 py-4 space-y-2">
        <WidgetBanner />
        <div className="space-y-10 overflow-x-hidden">
          {sections.map((section, idx) => (
            <div key={section.id} id={section.id} className="w-full max-w-full overflow-hidden">
              <LazySection section={section} />
              {(idx + 1) % 3 === 0 && idx < sections.length - 1 && (
                <div key={`ad-banner-${idx}`}>
                  <AdBanner />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
