"use client";

import { Suspense } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/web/main-page/sidebar-layout";
import { MainLayout, sidebarOpenAtom } from "@/components/web/main-page/main-layout";

import { useAtom } from "jotai";

export function AppProviders({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  return (
    <SidebarProvider defaultOpen={open} open={open} onOpenChange={setOpen}>
      <Suspense fallback={null}>
        <MainSidebar />
      </Suspense>
      <MainLayout>
        {/* TODO : MAKE COMMAND MENU LIKE 21ST.DEV */}
        {/* <CommandMenu /> */}
        {children}
      </MainLayout>
    </SidebarProvider>
  );
}
