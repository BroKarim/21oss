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
  title: string;
  imageUrl: string;
  categoryId: string;
}
