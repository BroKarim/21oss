"use client";

import * as React from "react";
import { BookOpen, PenTool, Palette, LayoutGrid, BotMessageSquare, DiamondPercent, AppWindowMac } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavLogo } from "./nav-logo";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Explore",
      url: "/",
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: "Awesome List",
      url: "/awesome-list",
      icon: PenTool,
    },
    {
      title: "Top 5",
      url: "/top-5",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Programming",
      icon: AppWindowMac,
      isActive: true,
      items: [
        { title: "APIs & Integration", url: "/categories/programming#apis-and-integration" },
        { title: "Backend", url: "/categories/programming#backend" },
        { title: "Dev Tools", url: "/categories/programming#dev-tools" },
        { title: "Frontend", url: "/categories/programming#frontend" },
      ],
    },
    {
      title: "AI",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        { title: "Agents & Automation", url: "/categories/ai#agents-and-automation" },
        { title: "LLM Ecosystem", url: "/categories/ai#llm-ecosystem" },
        { title: "Generative AI", url: "/categories/ai#generative-ai" },
      ],
    },
    {
      title: "Marketing",
      icon: DiamondPercent,
      isActive: true,
      items: [
        { title: "Analytics & Tracking", url: "/categories/marketing#analytics" },
        { title: "Email", url: "/categories/marketing#email" },
        { title: "Content", url: "/categories/marketing#seo-tools" },
      ],
    },
    {
      title: "Design",
      icon: Palette,
      isActive: true,
      items: [
        { title: "3D & Motion", url: "/categories/design#3d-and-motion" },
        { title: "Asset Generators", url: "/categories/design#asset" },
        { title: "Colors", url: "/categories/design#colors" },
        { title: "Typography", url: "/categories/design#typography" },
        { title: "UI/UX", url: "/categories/design#ui-ux" },
        { title: "Utility & Software", url: "/categories/design#utility-and-software" },
      ],
    },
  ],
};

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
