"use client";

import React from "react";
import { LayoutGrid, LayoutPanelTop, AppWindowMac, BotMessageSquare } from "lucide-react";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Buat peta icon di sini
const iconMap = {
  LayoutGrid,
  LayoutPanelTop,
  AppWindowMac,
  BotMessageSquare,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`
                  text-md transition-colors
                  ${item.isActive ? "bg-white/10 text-white hover:bg-white/15" : "text-white/60 hover:text-white hover:bg-white/10"}
                `}
              >
                <a href={item.url} className="w-full flex items-center">
                  {Icon && <Icon className="mr-2 h-5 w-5" />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
