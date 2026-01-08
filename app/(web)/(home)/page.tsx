import { Suspense } from "react";
import type { SearchParams } from "nuqs";
import { ToolType } from "@prisma/client";
import { ResourcesTabs } from "@/components/web/tools/resources/resources-tab";
import { ResourcesList } from "@/components/web/tools/resources/resources-list";
import { SortFilter } from "@/components/web/tools/resources/sort-filter";
import { StackFilter } from "@/components/web/tools/resources/stack-filter";
import { PlatformFilter } from "@/components/web/tools/resources/platforms-fiter";
import { SubmitForm } from "@/components/web/tools/resources/submit-form";
import { ActiveFilters } from "@/components/web/tools/resources/active-filters";
import { resourcesParamsCache } from "@/server/web/shared/schema";
import { getStackFilters, getPlatformFilters } from "@/server/web/tools/actions";

type ResourcesPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: ResourcesPageProps) {
  const params = resourcesParamsCache.parse(await searchParams);
  const [stacks, platforms] = await Promise.all([getStackFilters(), getPlatformFilters()]);
  return (
    <div className="min-h-screen  mx-auto bg-background/50 flex flex-1 flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-3xl md:mt-8 space-y-10 text-center">
        <div className="space-y-4 flex items-center justify-center flex-col">
          <h2 className="text-3xl sm:text-4xl  font-bold tracking-tight px-4">Open-Source Resources That Actually Ship</h2>
          <p className="text-neutral-400 font-mono text-sm sm:text-base lg:text-lg leading-relaxed">Hand-picked templates, components, and assets to speed up your workflow—ready to use, open-source friendly.</p>
          <SubmitForm />
        </div>
      </div>

      <div className="space-y-4 mx-auto w-full mt-16">
        <div className="relative flex items-center">
          <div className="mx-auto">
            <ResourcesTabs defaultValue={params.type} />
          </div>

          <div className="absolute right-0 flex gap-3">
            <SortFilter />
            <StackFilter stacks={stacks} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full flex items-center justify-center">
          {params.type === ToolType.Template && (
            <div className="w-full flex items-center justify-center">
              <PlatformFilter platforms={platforms} />
            </div>
          )}
        </div>
        <div className="w-full flex justify-center">
          <ActiveFilters stacks={stacks} platforms={platforms} />
        </div>

        <Suspense
          key={params.type}
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          }
        >
          <ResourcesList params={params} />
        </Suspense>
      </div>
    </div>
  );
}
