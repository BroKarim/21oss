"use client";

import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import { Input } from "@/components/ui/input";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SearchTrigger() {
  const search = useSearch();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem className="sm:mx-2">
        <SidebarMenuButton
          onClick={search.open}
          className={cn("relative  md:my-2 rounded-md bg-background cursor-pointer transition-all", "bg-gradient-to-r from-white/20 via-white/10 to-white/5", "shadow-[inset_0_1px_rgb(255_255_255/0.15)]", "border-none backdrop-blur-sm")}
        >
          {!isCollapsed && <Input placeholder="Search..." readOnly className="cursor-pointer ring-0 border-none" />}

          <SearchIcon className={cn("text-muted-foreground transition-all", isCollapsed ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : "absolute right-5 top-1/2 -translate-y-1/2")} size={16} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
