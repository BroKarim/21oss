import { ToolViewer } from "./tools/tool-viewer";
import { FlowNode, ScreenshotType } from "@/types/globals";

interface ToolDisplayProps {
  path: FlowNode[];
  screenshots: ScreenshotType[];
}

export function ToolDisplay({ path, screenshots }: ToolDisplayProps) {
  return <ToolViewer path={path} screenshots={screenshots} />;
}
