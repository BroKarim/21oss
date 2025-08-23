"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { MainSidebar } from "@/components/web/main-page/sidebar-layout";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button-shadcn";
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
          {!isAdmin && <Header />}
          {children}
          {!isAdmin && <Footer4Col />}
        </MainLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isBaseUrl = pathname === "/";
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="lg:hidden p-0" />
        {!isBaseUrl && (
          <Button variant="ghost" size="icon" className=" flex gap-1 " onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />back
          </Button>
        )}
      </div>

      <div className="hidden md:flex md:w-auto md:flex-none">
        <InfoDialog />
      </div>
    </header>
  );
}
