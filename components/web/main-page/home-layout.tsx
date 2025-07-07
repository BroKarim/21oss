import { HorizontalSlider } from "./horizontal-slider";
import { SortOption } from "@/types/globals";
import { Suspense } from "react";
import { ShowCasePreview, ShowCasePreviewSkeleton } from "../showcase/showcase-preview";

interface HomeTabLayoutProps {
  sortBy?: SortOption;
}

export function HomeTabLayout({}: HomeTabLayoutProps) {
  return (
    <div className="space-y-8 md:mt-4">
      <HorizontalSlider />
      <Suspense fallback={<ShowCasePreviewSkeleton />}>
        <ShowCasePreview />
      </Suspense>
    </div>
  );
}
