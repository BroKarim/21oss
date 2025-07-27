import { ToolViewer } from "./tools/tool-viewer";
import { ScreenshotType } from "@/types/globals";

interface ToolDisplayProps {
  screenshots: ScreenshotType[];
}

export function ToolDisplay({ screenshots }: ToolDisplayProps) {
  return <ToolViewer screenshots={screenshots} />;
}
