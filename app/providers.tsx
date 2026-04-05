"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMounted } from "@mantine/hooks";
import { sidebarOpenAtom } from "@/components/web/main-page/main-layout";
import { useAtom } from "jotai";
import { Footer } from "@/components/web/footer";

export function AppProviders({ children, adminSidebar }: { children: React.ReactNode; adminSidebar: React.ReactNode }) {
  const pathname = usePathname();
  const isMounted = useMounted();
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <SidebarProvider defaultOpen={false} open={isMounted ? open : false} onOpenChange={setOpen}>
      {isAdmin ? (
        <div className="flex min-h-screen w-full">
          <Suspense fallback={null}>{adminSidebar}</Suspense>
          <div className="flex min-h-screen w-full flex-col">
            <main className="flex-1 w-full min-w-0">{children}</main>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full min-h-screen">
          {/* {!isAdmin && <Header />} */}
          <main className="flex-1 w-full">{children}</main>
          {!isAdmin && <Footer />}
        </div>
      )}
    </SidebarProvider>
  );
}
// function Header() {
//   const search = useSearch();
//   return (
//     <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-8 justify-between">
//       <div className="flex items-center gap-3">
//         <Link href="/">
//           <NavLogo />
//         </Link>
//       </div>

//       <div className="hidden sm:flex items-center justify-center">
//         <Button variant="outline" className="text-foreground dark:bg-card hover:bg-muted/50 relative h-8 w-full justify-start pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 " onClick={search.open}>
//           <span className="hidden lg:inline-flex">Search tool...</span>
//           <span className="inline-flex lg:hidden">Search...</span>
//         </Button>
//         <Link href="/student">
//           <Button variant="ghost" className="hidden z-50 md:flex gap-1">
//             <Icons.fire />
//             For Students
//           </Button>
//         </Link>

//         <InfoDialog />
//       </div>
//     </header>
//   );
// }
