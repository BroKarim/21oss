// src/config/homeSections.ts

import { findFeaturedTool, findToolsWithCategories, findRecentTools, findToolsByStack } from "@/server/web/tools/queries";
import { ToolMany } from "@/server/web/tools/payloads";

export type HomeSection = {
  id: string;
  label: string;
  type: "slider" | "favicon" | "gallery";
  fetchFn: () => Promise<ToolMany[]>;
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};
export const homeSections: HomeSection[] = [
  {
    id: "featured",
    label: "Featured Tools",
    type: "slider",
    fetchFn: () => findFeaturedTool({ take: 8 }),
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/featured",
    },
  },
  {
    id: "recent",
    label: "Recently Added",
    type: "gallery",
    fetchFn: () => findRecentTools({ take: 6 }),
    options: {
      loadMore: true,
    },
  },
  // --- Category Sections ---
  {
    id: "design",
    label: "Design Tools",
    type: "slider",
    fetchFn: () =>
      findToolsWithCategories({
        where: { categories: { some: { slug: "design" } } },
      }),
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design",
    },
  },
  {
    id: "video",
    label: "Video Tools",
    type: "slider",
    fetchFn: () => findToolsWithCategories({ where: { categories: { some: { slug: "video" } } }, take: 8 }),
    options: {
      showScroll: false,
      showViewAll: false,
    },
  },
  // --- Stack Sections ---
  {
    id: "react",
    label: "Made with React",
    type: "favicon",
    fetchFn: () => findToolsByStack("react", { take: 10 }),
    options: {},
  },
  {
    id: "shadcn",
    label: "Built using shadcn/ui",
    type: "favicon",
    fetchFn: () => findToolsByStack("shadcn", { take: 10 }),
    options: {},
  },
  // --- Manual List Example ---
  {
    id: "recording",
    label: "Recording Tools",
    type: "slider",
    fetchFn: async () => {
      const slugs = ["cleanvoice", "audacity", "descript"];
      return findToolsWithCategories({ where: { slug: { in: slugs } } });
    },
    options: {
      showScroll: false,
      showViewAll: false,
    },
  },
];
