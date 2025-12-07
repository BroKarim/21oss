import { cn } from "@/lib/utils";
import WidgetBanner from "@/components/web/ui/banner";
// import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
import { getCuratedLists } from "@/server/web/curated-lists/actions";
// import { getRecentTools } from "@/server/web/tools/actions";
import ScrollToSlug from "@/components/web/scroll-to-slug";
import Link from "next/link";
import CuratedCard from "@/components/web/curated-card";

export default async function Page() {
  const curatedLists = await getCuratedLists();
  // const recentTools = await getRecentTools();

  // const recentSection = {
  //   id: "recent",
  //   label: "Recently Added",
  //   type: "gallery" as const,
  //   tools: recentTools,
  //   options: {
  //     loadMore: true,
  //     showScroll: false,
  //     showViewAll: false,
  //   },
  // };

  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <ScrollToSlug />
      <div className="container py-4 space-y-6 ">
        <WidgetBanner />
        {/* <div id="recent">
          <LazySection section={recentSection} />
        </div> */}
        <AdBanner />
        <section id="curated-lists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedLists.map((list) => (
              <Link key={list.id} href={`/curated/${list.url}`} className="block h-full">
                <CuratedCard title={list.title} description={list.description ?? ""} previewTools={list.tools.map((t) => t.name)} totalToolCount={list._count?.tools ?? 0} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
