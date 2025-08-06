"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/web/main-page/sidebar-layout";
import { AdminSidebar } from "@/components/admin/sidebar";
import { MainLayout, sidebarOpenAtom } from "@/components/web/main-page/main-layout";
import { CommandMenu } from "@/components/web/main-page/command-menu";
import { useAtom } from "jotai";
import Footer4Col from "@/components/web/footers";

export function AppProviders({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <SidebarProvider defaultOpen={open} open={open} onOpenChange={setOpen}>
      <Suspense fallback={null}>{isAdmin ? <AdminSidebar /> : <MainSidebar />}</Suspense>
      <MainLayout>
        {/* TODO : MAKE COMMAND MENU LIKE 21ST.DEV */}
        {/* <CommandMenu /> */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          Building Your Application
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none gap-2">
            <CommandMenu />
          </div>
        </header>
        {children}
        {!isAdmin && <Footer4Col />}
      </MainLayout>
    </SidebarProvider>
  );
}
