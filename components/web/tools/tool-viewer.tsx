"use client";

import { ScreenshotType } from "@/types/globals";
import Image from "next/image";

interface ToolViewerProps {
  screenshots: ScreenshotType[];
}

export function ToolViewer({ screenshots }: ToolViewerProps) {
  return (
    <div className="w-full  h-full min-h-[300px] ">
      <div className="w-full grid md:grid-cols-2 gap-2">
        {screenshots.map((screenshot, idx) => (
          <div key={idx} className="relative group w-full overflow-hidden rounded-2xl border shadow-sm">
            <Image src={screenshot.imageUrl} alt={screenshot.caption || `Screenshot ${idx + 1}`} width={1280} height={720} className="w-full h-auto object-contain transition duration-300 group-hover:brightness-25 border-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
