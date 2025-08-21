import { cn } from "@/lib/utils";
import { Banner } from "@/components/web/ui/banner";
import { homeSections } from "@/lib/constants/home-sections";
import LazySection from "@/components/web/lazy-section";
import { AdBanner } from "@/components/web/ads/ad-banner";
export default function Page() {
  const groupedSections: (typeof homeSections | (typeof homeSections)[number])[] = [];
  let tempFaviconGroup: (typeof homeSections)[number][] = [];
  homeSections.forEach((section, index) => {
    if (section.type === "favicon") {
      tempFaviconGroup.push(section);
      const next = homeSections[index + 1];
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
    <main className={cn("flex flex-1 flex-col overflow-x-hidden")}>
      <div className="container space-y-2 p-4 max-w-full">
        <Banner />
        <div className="space-y-10 overflow-x-hidden">
          {groupedSections.map((group, idx) => {
            const elements = [];

            // Render grup section normal
            if (Array.isArray(group)) {
              elements.push(
                <div key={`favicon-group-${idx}`} className="flex gap-4">
                  {group.map((section, secIdx) => (
                    <div key={`${section.id}-${secIdx}`} className="flex-1">
                      <LazySection section={section} />
                    </div>
                  ))}
                </div>
              );
            } else {
              // section biasa
              elements.push(<LazySection key={`${group.id}-${idx}`} section={group} />);
            }

            // Sisipkan AdBanner/hello world setiap 3 grup (idx dimulai dari 0)
            // Jadi akan muncul setelah grup ke-3, ke-6, ke-9, dst
            if ((idx + 1) % 3 === 0 && idx < groupedSections.length - 1) {
              elements.push(
                <div key={`ad-banner-${idx}`}>
                  <AdBanner type="All" />
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
