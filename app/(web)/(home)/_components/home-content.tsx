import { ResourceGrid } from "./resource-grid";
import type { ToolList } from "@/server/web/tools/payloads";
import type { StackItem } from "../_lib/types";
import { WebShell } from "../../_components/web-shell";
import { AdRotator } from "./ad-rotator";

type HomeContentProps = {
  stacks: StackItem[];
  initialResources: ToolList[];
  initialNextCursor: string | undefined;
  initialNextPage: number | null;
  initialHasMore: boolean;
  totalCount: number;
  toolPageAds: any[];
  ads: any[];
  title: string;
  description: string;
};

export function HomeContent({ stacks, initialResources, initialNextCursor, initialNextPage, initialHasMore, totalCount, toolPageAds, ads, title, description }: HomeContentProps) {
  return (
    <WebShell stacks={stacks}>
      <div className="min-h-screen">
        <ResourceGrid
          initialResources={initialResources}
          initialNextCursor={initialNextCursor}
          initialNextPage={initialNextPage}
          initialHasMore={initialHasMore}
          totalCount={totalCount}
          toolPageAds={toolPageAds}
          title={title}
          description={description}
        />
        <AdRotator ads={ads} />
      </div>
    </WebShell>
  );
}
