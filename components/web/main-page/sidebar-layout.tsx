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
        { title: "Frontend", url: "/categories/models-and-training" },
        { title: "Backend", url: "/categories/agents-and-automation" },
        { title: "Components", url: "/categories/ai-infra-tools" },
        { title: "Dev Tools", url: "/categories/ai-infra-tools" },
        { title: "APIs & Integration", url: "/categories/ai-infra-tools" },
      ],
    },
    {
      title: "AI",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        { title: "Images & Videos", url: "/categories/models-and-training" },
        { title: "Text & Speech", url: "/categories/agents-and-automation" },
        { title: "Productivity", url: "/categories/ai-infra-tools" },
        { title: "LLM Ecosystem", url: "/categories/ai-infra-tools" },
      ],
    },
    {
      title: "Marketing",
      icon: DiamondPercent,
      isActive: true,
      items: [
        { title: "SEO Tools", url: "/categories/seo-tools" },
        { title: "Email & Campaigns", url: "/categories/email-campaigns" },
        { title: "Analytics & Tracking", url: "/categories/analytics-tracking" },
      ],
    },
    {
      title: "Design",
      icon: Palette,
      isActive: true,
      items: [
        { title: "Colors", url: "/categories/ui-kits-libraries" },
        { title: "Typography", url: "/categories/design-tools" },
        { title: "Asset", url: "/categories/asset-generators" },
        { title: "UI/UX", url: "/categories/asset-generators" },
        { title: "Utility & Software", url: "/categories/asset-generators" },
        { title: "3D & Motion", url: "/categories/asset-generators" },
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
