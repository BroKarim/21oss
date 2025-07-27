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

export type ScreenshotType = {
  id: string;
  imageUrl: string;
  caption?: string | null;
  githubUrl?: string | null;
  order: number;
};
