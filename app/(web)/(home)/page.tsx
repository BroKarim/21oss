import { cn } from "@/lib/utils";

import { AnimatePresence } from "motion/react";
import React from "react";

import { HomeTabLayout } from "@/components/web/main-page/home-layout";
import { BoltBanner } from "@/components/web/ui/banner";
import { SidebarInset } from "@/components/ui/sidebar";
import { CommandMenu } from "@/components/web/main-page/command-menu";
// TODO : Agar bs render di halam yg sama, nengok apps/web/app/page.client.tsx (21st.dev)

export default function Page() {
  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <SidebarInset className="p-0">
        <header className="flex h-16 justify-between px-4 shrink-0 items-center  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 ">Data Fetching</div>
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu />
          </div>
        </header>
      </SidebarInset>
      <div className="container p-4">
        <AnimatePresence>
          <BoltBanner />
        </AnimatePresence>
        <HomeTabLayout />
      </div>
    </main>
  );
}
