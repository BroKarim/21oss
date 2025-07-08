"use client";

import { Suspense } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/web/main-page/sidebar-layout";
import { MainLayout, sidebarOpenAtom } from "@/components/web/main-page/main-layout";
import { Separator } from "@/components/ui/separator";
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          Building Your Application
        </header>
        {children}
      </MainLayout>
    </SidebarProvider>
  );
}
