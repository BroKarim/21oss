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
      viewAllUrl: "/categories/programming#dev-tools",
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
      viewAllUrl: "/categories/ai#llm-ecosystem",
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
      viewAllUrl: "/categories/ai#images-and-videos",
    },
  },
  {
    id: "ui/ux",
    label: "Interface Design Toolkit",
    type: "slider",
    actionName: "getUIUXTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design#ui-ux",
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
  {
    id: "utilities",
    label: "Boost Your Creativity with These Utilities",
    type: "gallery",
    actionName: "getUtilityTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design#utility-and-software",
    },
  },
  {
    id: "apis",
    label: "Unlock the Power of Connectivity",
    type: "gallery",
    actionName: "getApiTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design#apis-and-integration",
    },
  },
];
