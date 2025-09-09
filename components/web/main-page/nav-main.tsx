"use client";

import React from "react";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="text-md" tooltip={item.title}>
                <a href={item.url} className="w-full">
                  {Icon && <Icon className="mr-1 h-5 w-5" />}
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
