import { cn } from "@/lib/utils";

import { AnimatePresence } from "motion/react";
import React from "react";

import { HomeTabLayout } from "@/components/web/main-page/home-layout";
import { BoltBanner } from "@/components/web/ui/banner";
// TODO : Agar bs render di halam yg sama, nengok apps/web/app/page.client.tsx (21st.dev)

export default function Page() {
  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <div className="container p-4">
        <AnimatePresence>
          <BoltBanner />
        </AnimatePresence>
        <HomeTabLayout />
      </div>
    </main>
  );
}
