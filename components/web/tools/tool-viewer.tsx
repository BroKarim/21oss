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
    <div className="w-full flex h-full">
      <div className="w-1/4  bg-muted h-[300px] overflow-y-auto rounded-md">
        <Tree className="overflow-hidden rounded-md p-2" initialSelectedId={path[0]?.label} initialExpandedItems={path.map((p) => p.id)} elements={treeElements}>
          {renderTree(treeElements)}{" "}
        </Tree>
      </div>
      <div className="flex-1">
        <ToolViewerImage screenshots={screenshots} />
      </div>
    </div>
  );
}
