"use client";

import React from "react";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Icons } from "../icons";

const iconMap = {
  "Explore": Icons.globe,
  "Beautiful Table": Icons.ogTable,
};

interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = iconMap[item.title as keyof typeof iconMap];

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`
              text-md transition-all duration-300 ease-in-out rounded-md
              ${
                item.isActive
                  ? `
                    text-white
                    bg-gradient-to-r from-white/20 via-white/10 to-white/5
                    transition-colors shadow-[inset_0_1px_rgb(255_255_255/0.15)]
                    border-none
                    backdrop-blur-sm
                  `
                  : `
                    text-white/60 hover:text-white
                    hover:bg-white/10
                  `
              }
            `}
              >
                <a href={item.url} className="w-full flex items-center px-3 py-2">
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
