import { Suspense } from "react";
import { HomeContent } from "./home-content";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";
import { FiltersProvider } from "@/contexts/filter-context";

type HomeClientProps = {
  stacks: StackItem[];
  initialResources: ToolList[];
  initialNextCursor: string | undefined;
  initialHasMore: boolean;
  totalCount: number;
  toolPageAds: any[];
  ads: any[];
  title: string;
  description: string;
};

export function HomeClient({
  stacks,
  initialResources,
  initialNextCursor,
  initialHasMore,
  totalCount,
  toolPageAds,
  ads,
  title,
  description,
}: HomeClientProps) {
  return (
    <FiltersProvider enableSort enableFilters>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        }
      >
        <HomeContent
          stacks={stacks}
          initialResources={initialResources}
          initialNextCursor={initialNextCursor}
          initialHasMore={initialHasMore}
          totalCount={totalCount}
          toolPageAds={toolPageAds}
          ads={ads}
          title={title}
          description={description}
        />
      </Suspense>
    </FiltersProvider>
  );
}
