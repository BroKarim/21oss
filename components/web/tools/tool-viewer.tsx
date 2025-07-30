"use client";

import { ScreenshotType } from "@/types/globals";
import { Button } from "@/components/ui/button-shadcn";
import { Github } from "lucide-react";
import Image from "next/image";

interface ToolViewerProps {
  screenshots: ScreenshotType[];
}

export function ToolViewer({ screenshots }: ToolViewerProps) {
  console.log(`Screenshot :`, screenshots); // Debug data
  console.log(`GitHub URL:`, screenshots.githubUrl);
  return (
    <div className="w-full  h-full min-h-[300px] ">
      <div className="w-full grid md:grid-cols-2 gap-2">
        {screenshots.map((screenshot, idx) => (
          <div key={idx} className="relative group w-full overflow-hidden rounded-2xl border shadow-sm">
            <Image src={screenshot.imageUrl} alt={screenshot.caption || `Screenshot ${idx + 1}`} width={1280} height={720} className="w-full h-auto object-contain transition duration-300 group-hover:brightness-25 border-none" />
            {screenshot.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="secondary" className="rounded-full shadow-lg" onClick={() => window.open(screenshot.githubUrl, "_blank")}>
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
