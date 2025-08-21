"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/web/main-page/sidebar-layout";
import { AdminSidebar } from "@/components/admin/sidebar";
import { MainLayout, sidebarOpenAtom } from "@/components/web/main-page/main-layout";
import { InfoDialog } from "@/components/web/ui/info-dialog";
import { useAtom } from "jotai";
import Footer4Col from "@/components/web/footers";

export function AppProviders({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <SidebarProvider defaultOpen={open} open={open} onOpenChange={setOpen}>
      <Suspense fallback={null}>{isAdmin ? <AdminSidebar /> : <MainSidebar />}</Suspense>
      <SidebarInset>
        <MainLayout>
          {/* TODO : MAKE COMMAND MENU LIKE 21ST.DEV */}
          {!isAdmin && <Header />}
          {children}
          {!isAdmin && <Footer4Col />}
        </MainLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="lg:hidden p-0" />
        <h1 className="md:text-lg font-semibold">Building Your Application</h1>
      </div>

      <div className="hidden md:flex md:w-auto md:flex-none">
        <InfoDialog />
      </div>
    </header>
  );
}
