import { ResourceGrid } from "./resource-grid";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";
import { WebShell } from "../../_components/web-shell";
import { AdRotator } from "./ad-rotator";
import type { ResourcesParams } from "@/server/web/shared/schema";

type HomeContentProps = {
  stacks: StackItem[];
  initialResources: ToolList[];
  initialNextCursor: string | undefined;
  initialHasMore: boolean;
  totalCount: number;
  toolPageAds: any[];
  searchParams: ResourcesParams;
  ads: any[];
  title: string;
  description: string;
};

export function HomeContent({ stacks, initialResources, initialNextCursor, initialHasMore, totalCount, toolPageAds, searchParams, ads, title, description }: HomeContentProps) {
  return (
    <WebShell stacks={stacks}>
      <div className="min-h-screen">
        <ResourceGrid
          initialResources={initialResources}
          initialNextCursor={initialNextCursor}
          initialHasMore={initialHasMore}
          totalCount={totalCount}
          toolPageAds={toolPageAds}
          searchParams={searchParams}
          title={title}
          description={description}
        />
        <AdRotator ads={ads} />
      </div>
    </WebShell>
  );
}
