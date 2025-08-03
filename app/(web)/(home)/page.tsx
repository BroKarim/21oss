import { cn } from "@/lib/utils";

import { AnimatePresence } from "motion/react";
import React from "react";
import { BoltBanner } from "@/components/web/ui/banner";
import { homeSections, HomeSection } from "@/lib/constants/home-sections";
import { sectionComponents } from "@/lib/constants/section-components";

export default async function Page() {
  const sectionsWithData = await Promise.all(
    homeSections.map(async (section: HomeSection) => {
      const tools = await section.fetchFn();
      return { id: section.id, label: section.label, type: section.type, options: section.options, tools };
    })
  );

  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <div className="container space-y-2 p-4">
        <AnimatePresence>
          <BoltBanner />
        </AnimatePresence>
        {/* <HomeTabLayout /> */}
        <div className="space-y-10">
          {sectionsWithData.map((section, idx) => {
            if (!section.tools?.length) {
              return (
                <div key={idx} className="text-center text-gray-500">
                  No tools available for {section.label}.
                </div>
              );
            }

            const SectionComponent = sectionComponents[section.type];
            return <SectionComponent key={idx} {...section} />;
          })}
        </div>
      </div>
    </main>
  );
}
