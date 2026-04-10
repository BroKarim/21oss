import type { SearchParams } from "nuqs/server";
import { ToolType } from "@prisma/client";
import { HomeClient } from "./_components/home-client";
import { resourcesParamsCache } from "@/server/web/shared/schema";
import { getResources, getStackFilters } from "@/server/web/tools/actions";
import { getActiveAds } from "@/server/web/ads/queries";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const params = resourcesParamsCache.parse(await searchParams);
  const resourcesPromise = getResources({ ...params, type: ToolType.Template });
  const [stacks, resources, ads] = await Promise.all([getStackFilters(), resourcesPromise, getActiveAds()]);

  return <HomeClient stacks={stacks} resources={resources} ads={ads} title="Opensource Starter Templates" description="Discover Open-source templates, starters, or boilerplate to jumpstart your application or website build." />;
}
