import { Suspense } from "react";
import { ResourcesTabs } from "@/components/web/tools/resources/resources-tab";
import { ResourcesList } from "@/components/web/tools/resources/resources-list";
import type { SearchParams } from "nuqs";
import { resourcesParamsCache } from "@/server/web/shared/schema";

type ResourcesPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: ResourcesPageProps) {
  const params = resourcesParamsCache.parse(await searchParams);

  return (
    <div className="min-h-screen bg-background/50 flex flex-1 flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-3xl md:mt-8 space-y-10 text-center">
        <div className="space-y-4 flex items-center justify-center flex-col">
          <h2 className="text-3xl sm:text-4xl  font-bold tracking-tight px-4">Open-Source Resources That Actually Ship</h2>
          <p className="text-neutral-400 font-mono text-sm sm:text-base lg:text-lg leading-relaxed">Hand-picked templates, components, and assets to speed up your workflow—ready to use, open-source friendly.</p>
        </div>
      </div>

      <div className="space-y-2 mx-auto w-full mt-16">
        <ResourcesTabs defaultValue={params.type} />
        <Suspense
          key={params.type} // Re-mount on filter change
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
