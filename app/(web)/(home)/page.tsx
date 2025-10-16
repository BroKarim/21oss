import { cn } from "@/lib/utils";
import WidgetBanner from "@/components/web/ui/banner";
import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
import { getRecentTools } from "@/server/web/tools/actions";

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
      id: curatedList.id,
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
      <div className="w-full max-w-full px-4 py-4 space-y-2">
        <WidgetBanner />
        <div className="space-y-10 overflow-x-hidden">
          {sections.map((section, idx) => (
            <div key={section.id} className="w-full max-w-full overflow-hidden">
              <LazySection section={section} />

              {/* sisipkan iklan setiap 3 section */}
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
