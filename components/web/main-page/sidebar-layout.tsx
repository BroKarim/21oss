"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, PenTool, Command, Palette, GalleryVerticalEnd, SquareKanban, Bitcoin, LayoutGrid, BotMessageSquare, DiamondPercent, AppWindowMac, Workflow, Database, EarthLock } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { NavLogo } from "./nav-logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Explore",
      url: "/",
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: PenTool,
    },
    {
      title: "Blog",
      url: "/blog",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Programming",
      icon: AppWindowMac,
      isActive: true,
      items: [
        { title: "Frontend", url: "/categories/programming#frontend" },
        { title: "Backend", url: "/categories/programming#backend" },
        { title: "Components", url: "/categories/programming#components" },
        { title: "Dev Tools", url: "/categories/programming#dev-tools" },
        { title: "APIs & Integration", url: "/categories/programming#programming/apis-and-integration" },
      ],
    },
    {
      title: "AI",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        { title: "LLM Ecosystem", url: "/categories/ai#llm-ecosystem" },
        { title: "Text & Speech", url: "/categories/ai#text-and-speech" },
        { title: "Images & Videos", url: "/categories/ai#images-and-videos" },
      ],
    },
    {
      title: "Marketing",
      icon: DiamondPercent,
      isActive: true,
      items: [
        { title: "SEO Tools", url: "/categories/marketing#seo-tools" },
        { title: "Email", url: "/categories/marketing#email" },
        { title: "Analytics & Tracking", url: "/categories/marketing#analytics" },
      ],
    },
    {
      title: "Design",
      icon: Palette,
      isActive: true,
      items: [
        { title: "Colors", url: "/categories/design#colors" },
        { title: "Typography", url: "/categories/design#typography" },
        { title: "Asset Generators", url: "/categories/design#asset" },
        { title: "UI/UX", url: "/categories/design#ui-ux" },
        { title: "Utility & Software", url: "/categories/design#utility-and-software" },
        { title: "3D & Motion", url: "/categories/design#3d-and-motion" },
      ],
    },
  ],
};

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
