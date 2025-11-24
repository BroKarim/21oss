import { cn } from "@/lib/utils";
import WidgetBanner from "@/components/web/ui/banner";
import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
import { getRecentTools } from "@/server/web/tools/actions";
import ScrollToSlug from "@/components/web/scroll-to-slug";

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
      id: curatedList.url ?? "",
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
    <main className={cn("flex flex-1 flex-col ")}>
      <ScrollToSlug />
      <div className="container py-4 space-y-6 ">
        <WidgetBanner />
        <div className="space-y-10 ">
          {sections.map((section, idx) => (
            <div key={section.id} id={section.id}>
              <LazySection section={section} />
              {(idx + 1) % 3 === 0 && idx < sections.length - 1 && (
                <div className="" key={`ad-banner-${idx}`}>
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
