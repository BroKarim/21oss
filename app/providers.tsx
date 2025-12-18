"use client";

import React, { Suspense } from "react";
import { NavLogo } from "@/components/web/main-page/nav-logo";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { useMounted } from "@mantine/hooks";
import { Icons } from "@/components/web/icons";
import { sidebarOpenAtom } from "@/components/web/main-page/main-layout";
import { InfoDialog } from "@/components/web/ui/info-dialog";
import { useAtom } from "jotai";
import { Footer } from "@/components/web/footer";
import { Button } from "@/components/ui/button-shadcn";
export function AppProviders({ children, adminSidebar }: { children: React.ReactNode; adminSidebar: React.ReactNode }) {
  const pathname = usePathname();
  const isMounted = useMounted();
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <SidebarProvider defaultOpen={false} open={isMounted ? open : false} onOpenChange={setOpen}>
      {isAdmin && <Suspense fallback={null}>{adminSidebar}</Suspense>}

      <div className="flex flex-col w-full min-h-screen">
        {!isAdmin && <Header />}

        <main className="flex-1 w-full">{children}</main>

        {!isAdmin && <Footer />}
      </div>
    </SidebarProvider>
  );
}
function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-8 justify-between">
      <div className="flex items-center gap-3">
        <Link href="/">
          <NavLogo />
        </Link>
      </div>

      <div className="hidden sm:flex items-center justify-center">
        <Link href="/collage">
          <Button variant="ghost" className="hidden z-50 md:flex gap-1">
            <Icons.fire />
            For Students
          </Button>
        </Link>
        <Link href="/blogs">
          <Button variant="ghost" className="hidden z-50 md:flex gap-1">
            <Icons.blogs />
            Blogs
          </Button>
        </Link>
        <InfoDialog />
      </div>
    </header>
  );
}
