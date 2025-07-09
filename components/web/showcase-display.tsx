
import { ShowcaseViewer } from "./showcase-viewer";

interface ShowcaseDisplayProps {
  categories: CategoryType[];
  screenshots: ScreenshotType[];
}

export function ShowcaseDisplay({ categories, screenshots }: ShowcaseDisplayProps) {
  return <ShowcaseViewer categories={categories} screenshots={screenshots} />;
}
