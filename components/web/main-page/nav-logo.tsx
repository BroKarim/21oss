"use client";

import * as React from "react";
import { LogoSymbol } from "@/components/ui/logo-symbol-2";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="bg-[#2e2e2e] text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-full size-8 group-data-[state=open]:size-10 transition-all duration-200">
            <LogoSymbol />
          </div>
          <div className="text-left md:text-3xl leading-tight">
            <span className="truncate font-bold ">21OSS</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
