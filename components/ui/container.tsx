"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "../web/main-page/main-layout";
import { useIsMobile } from "@/hooks/use-media-query";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open] = useAtom(sidebarOpenAtom);
  const isMobile = useIsMobile();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Always use mobile layout before hydration is complete
  const shouldAdjustForSidebar = mounted && !isMobile && open;

  return (
    <div
      className={cn("relative mx-auto w-full transition-all duration-200", className)}
      style={{
        width: "min(100%, 3680px)",
        maxWidth: shouldAdjustForSidebar ? "calc(100vw - 256px)" : "100vw",
      }}
    >
      {children}
    </div>
  );
}
