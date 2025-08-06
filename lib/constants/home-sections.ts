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
    id: "featured",
    label: "Featured Tools",
    type: "slider",
    actionName: "getFeaturedTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/featured",
    },
  },
  {
    id: "design",
    label: "Design Tools",
    type: "slider",
    actionName: "getDesignTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/design",
    },
  },
  {
    id: "development",
    label: "Development Tools",
    type: "slider",
    actionName: "getDevelopmentTools",
    options: {
      showScroll: true,
      showViewAll: true,
      viewAllUrl: "/categories/development",
    },
  },
  // Add more sections as needed
];
