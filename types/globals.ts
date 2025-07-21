export type SortOption = "downloads" | "likes" | "date" | "recommended" | "bookmarks";

export interface CategoryType {
  id: string;
  name: string;
  count: number;
  subcategories?: {
    id: string;
    name: string;
    count: number;
  }[];
}

export interface ScreenshotType {
  id: string;
  page?: string;
  caption: string | null;
  imageUrl: string;
  order?: number;
}

export type FlowNode = {
  id: string;
  label: string;
  parentId?: string | null;
  order: number;
  repositoryPath?: string | null;
  children?: FlowNode[];
};
