import { HorizontalSlider } from "./horizontal-slider";
import { SortOption } from "@/types/globals";
import { Suspense } from "react";
import { ToolPreview, ToolPreviewSkeleton } from "../tools/tool-preview";

interface HomeTabLayoutProps {
  sortBy?: SortOption;
}

export function HomeTabLayout({}: HomeTabLayoutProps) {
  return (
    <div className="space-y-8 md:mt-4">
      <HorizontalSlider />
      <Suspense fallback={<ToolPreviewSkeleton />}>
        <ToolPreview />
      </Suspense>
    </div>
  );
}
