"use client";

import { HorizontalSlider } from "./horizontal-slider";
import { SortOption } from "@/types/globals";

interface HomeTabLayoutProps {
  sortBy?: SortOption;
}

export function HomeTabLayout({}: HomeTabLayoutProps) {
  return (
    <div className="space-y-8 md:mt-4">
      <HorizontalSlider />
    </div>
  );
}
