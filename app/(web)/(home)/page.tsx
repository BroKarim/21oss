import { cn } from "@/lib/utils";
import WidgetBanner from "@/components/web/ui/banner";
import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
import { getRecentTools } from "@/server/web/tools/actions";
import { ToolMany } from "@/server/web/tools/payloads";
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
      type: curatedList.type as "slider" | "favicon" | "gallery",
      tools: curatedList.tools as ToolMany[],
      options: {
        showScroll: true,
        showViewAll: true,
        viewAllUrl: `/`,
        loadMore: false,
      },
    })),
  ];

  // Group favicon sections together
  const groupedSections: (typeof sections | (typeof sections)[number])[] = [];
  let tempFaviconGroup: (typeof sections)[number][] = [];

  sections.forEach((section, index) => {
    if (section.type === "favicon") {
      tempFaviconGroup.push(section);
      const next = sections[index + 1];
      if (!next || next.type !== "favicon") {
        groupedSections.push(tempFaviconGroup);
        tempFaviconGroup = [];
      }
    } else {
      if (tempFaviconGroup.length) {
        groupedSections.push(tempFaviconGroup);
        tempFaviconGroup = [];
      }
      groupedSections.push(section);
    }
  });
  return (
    <main className={cn("flex flex-1 flex-col min-h-0 w-full max-w-full overflow-x-hidden")}>
      <div className="w-full max-w-full px-4 py-4 space-y-2">
        <WidgetBanner />
        <div className="space-y-10 overflow-x-hidden">
          {groupedSections.map((group, idx) => {
            const elements = [];

            if (Array.isArray(group)) {
              elements.push(
                <div key={`favicon-group-${idx}`} className="md:flex gap-4">
                  {group.map((section, secIdx) => (
                    <div key={`${section.id}-${secIdx}`} className="w-full min-w-0 overflow-hidden">
                      <LazySection section={section} />
                    </div>
                  ))}
                </div>
              );
            } else {
              elements.push(
                <div key={`section-wrapper-${idx}`} className="w-full max-w-full overflow-hidden">
                  <LazySection key={`${group.id}-${idx}`} section={group} />
                </div>
              );
            }

            if ((idx + 1) % 3 === 0 && idx < groupedSections.length - 1) {
              elements.push(
                <div key={`ad-banner-${idx}`}>
                  <AdBanner />
                </div>
              );
            }

            return elements;
          })}
        </div>
      </div>
    </main>
  );
}
