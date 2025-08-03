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
      title: "AI",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        { title: "Models & Training", url: "/categories/models-and-training" },
        { title: "Agents & Automation", url: "/categories/agents-and-automation" },
        { title: "AI Infra / Tools", url: "/categories/ai-infra-tools" },
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
        { title: "UI Kits & Libraries", url: "/categories/ui-kits-libraries" },
        { title: "Design Tools", url: "/categories/design-tools" },
        { title: "Asset Generators", url: "/categories/asset-generators" },
      ],
    },
    {
      title: "Development",
      icon: AppWindowMac,
      isActive: true,
      items: [
        { title: "Libraries / SDKs", url: "/categories/libraries-sdks" },
        { title: "Frameworks", url: "/categories/frameworks" },
        { title: "CLI / Dev Tools", url: "/categories/cli-dev-tools" },
      ],
    },
    {
      title: "Finance",
      icon: Bitcoin,
      isActive: true,
      items: [
        { title: "Budget & Expense", url: "/categories/budget-expense" },
        { title: "Accounting Tools", url: "/categories/accounting-tools" },
        { title: "Crypto & DeFi", url: "/categories/crypto-defi" },
      ],
    },
    {
      title: "Productivity",
      icon: SquareKanban,
      isActive: true,
      items: [
        { title: "Notes & Docs", url: "/categories/notes-docs" },
        { title: "Task Management", url: "/categories/task-management" },
        { title: "Calendars & Schedulers", url: "/categories/calendars-schedulers" },
      ],
    },
    {
      title: "Security",
      icon: EarthLock,
      isActive: true,
      items: [
        { title: "Password Manager", url: "/categories/password-manager" },
        { title: "Audit & Scanner", url: "/categories/audit-scanner" },
        { title: "Privacy Tools", url: "/categories/privacy-tools" },
      ],
    },
    {
      title: "Data & Analytics",
      icon: Database,
      isActive: true,
      items: [
        { title: "BI Dashboards", url: "/categories/bi-dashboards" },
        { title: "Data Processing", url: "/categories/data-processing" },
        { title: "Database Tools", url: "/categories/database-tools" },
      ],
    },
    {
      title: "DevOps / Infrastructure",
      icon: Workflow,
      isActive: true,
      items: [
        { title: "CI/CD", url: "/categories/ci-cd" },
        { title: "Monitoring & Logs", url: "/categories/monitoring-logs" },
        { title: "Container & VM", url: "/categories/container-vm" },
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
