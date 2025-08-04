import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import React from "react";
import { BoltBanner } from "@/components/web/ui/banner";
import { homeSections } from "@/lib/constants/home-sections";
import LazySection from "@/components/web/lazy-section";

export default function Page() {
  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <div className="container space-y-2 p-4">
        <AnimatePresence>
          <BoltBanner />
        </AnimatePresence>

        <div className="space-y-10">
          {homeSections.map((section) => (
            <LazySection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
