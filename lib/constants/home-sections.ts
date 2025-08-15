export type HomeSection = {
  id: string;
  label: string;
  type: "slider" | "favicon" | "gallery";
  actionName: string;
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};
export const homeSections: HomeSection[] = [
  {
    id: "recent",
    label: "Recently Added",
    type: "gallery",
    actionName: "getRecentTools",
    options: {
      loadMore: true,
    },
  },
  {
    id: "dev",
    label: "Dev Tools",
    type: "favicon",
    actionName: "getDevelopmentTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design",
    },
  },
  {
    id: "llm",
    label: "AI Assistant Toolkit",
    type: "favicon",
    actionName: "getLlmTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/ai",
    },
  },
  {
    id: "ai tools",
    label: "AI Tools Collection",
    type: "gallery",
    actionName: "getAiTools",
    options: {
      showScroll: true,
      loadMore: true,
      showViewAll: true,
      viewAllUrl: "/categories/images-and-videos",
    },
  },
  {
    id: "ui/ux",
    label: "Interface Design Toolkit",
    type: "slider",
    actionName: "getUiUxTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/featured",
    },
  },

  {
    id: "development",
    label: "Development Tools",
    type: "gallery",
    actionName: "getDevelopmentTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/development",
    },
  },
  // Add more sections as needed
];
