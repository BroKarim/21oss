"use client";

import { Tree, flowNodesToTreeElements, renderTree } from "@/components/web/tools/tool-file-tree";
import { ToolViewerImage } from "@/components/web/tools/tool-viewer-image";
import { FlowNode, ScreenshotType } from "@/types/globals";

type ToolViewerProps = {
  path: FlowNode[];
  screenshots: ScreenshotType[];
};

export function ToolViewer({ path, screenshots }: ToolViewerProps) {
  const treeElements = flowNodesToTreeElements(path);

  return (
    <div className="w-full flex h-full min-h-[300px]">
      <div className="w-1/4 h-full overflow-y-auto rounded-md">
        <Tree className="overflow-hidden rounded-md p-2 text-base" initialSelectedId={path[0]?.label} initialExpandedItems={path.map((p) => p.id)} elements={treeElements}>
          {renderTree(treeElements)}{" "}
        </Tree>
      </div>
      <div className="flex-1 overflow-hidden">
        <ToolViewerImage screenshots={screenshots} />
      </div>
    </div>
  );
}
