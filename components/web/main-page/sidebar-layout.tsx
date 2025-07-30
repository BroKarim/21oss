"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, PenTool, Command, Frame, GalleryVerticalEnd, Map, PieChart, LayoutGrid } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
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
      url: "#",
      icon: LayoutGrid,
      isActive: true,
    },
    {
      //opensource creative tools to help you develop what you love
      // inspired by https://minimal.gallery/tools/
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
  projects: [
    {
      name: "Website",
      url: "/platforms/website",
      icon: Frame,
    },
    {
      name: "Android",
      url: "#",
      icon: PieChart,
    },
    {
      name: "iOS",
      url: "#",
      icon: Map,
    },
  ],
};

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo teams={data.teams} />
      </SidebarHeader>
      <SidebarContent >
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
