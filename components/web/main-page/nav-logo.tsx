"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { LogoSymbol } from "@/components/ui/logo-symbol-2";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavLogo({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="  aspect-square ">
            <LogoSymbol />
          </div>
          <div className="text-left md:text-4xl leading-tight">
            <span className="truncate font-bold font-mono">{activeTeam.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
