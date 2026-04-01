import type { SearchParams } from "nuqs/server";
import { ToolType } from "@prisma/client";
import { HomeClient } from "./_components/home-client";
import { resourcesParamsCache } from "@/server/web/shared/schema";
import { getResources, getStackFilters } from "@/server/web/tools/actions";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const params = resourcesParamsCache.parse(await searchParams);
  const resourcesPromise = getResources({ ...params, type: ToolType.Template });
  const [stacks, resources] = await Promise.all([getStackFilters(), resourcesPromise]);

  return (
    <HomeClient
      stacks={stacks}
      resources={resources}
      title="Templates"
      description="Open-source templates curated to help you ship faster."
    />
  );
}
