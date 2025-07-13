import { CategoryType, ScreenshotType } from "@/types/globals";
import { ToolViewer } from "./tool-viewer";

interface ToolDisplayProps {
  categories: CategoryType[];
  screenshots: ScreenshotType[];
}

export function ToolDisplay({ categories, screenshots }: ToolDisplayProps) {
  return <ToolViewer categories={categories} screenshots={screenshots} />;
}
