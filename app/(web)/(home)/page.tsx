import { cn } from "@/lib/utils";

import { AnimatePresence } from "motion/react";
import React from "react";
import { BoltBanner } from "@/components/web/ui/banner";
import { homeSections } from "@/lib/constants/home-sections";

import LazySection from "@/components/web/lazy-section";
export default function Page() {
  // const sectionsWithData = await Promise.all(
  //   homeSections.map(async (section: HomeSection) => {
  //     const tools = await section.fetchFn();
  //     return { id: section.id, label: section.label, type: section.type, options: section.options, tools };
  //   })
  // );

  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <div className="container space-y-2 p-4">
        <AnimatePresence>
          <BoltBanner />
        </AnimatePresence>
        {/* <HomeTabLayout /> */}
        <div className="space-y-10">
          {homeSections.map((section, idx) => (
            <LazySection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
