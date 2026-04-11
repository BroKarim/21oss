import type { SearchParams } from "nuqs/server";
import { ToolType, AdType } from "@prisma/client";
import { HomeClient } from "./_components/home-client";
import { resourcesParamsCache } from "@/server/web/shared/schema";
import { getResources, getStackFilters, getResourcesCount } from "@/server/web/tools/actions";
import { getActiveAds, getActiveAdsByType } from "@/server/web/ads/queries";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const params = resourcesParamsCache.parse(await searchParams);
  const [stacks, result, ads, totalCount, toolPageAds] = await Promise.all([
    getStackFilters(),
    getResources({ ...params, type: ToolType.Template }),
    getActiveAds(),
    getResourcesCount(ToolType.Template),
    getActiveAdsByType(AdType.ToolPage),
  ]);

  return (
    <HomeClient
      stacks={stacks}
      initialResources={result.items}
      initialNextCursor={result.nextCursor}
      initialHasMore={result.hasMore}
      totalCount={totalCount}
      toolPageAds={toolPageAds}
      searchParams={params}
      ads={ads}
      title="Opensource Starter Templates"
      description="Discover Open-source templates, starters, or boilerplate to jumpstart your application or website build."
    />
  );
}
