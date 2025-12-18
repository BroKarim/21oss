import { Suspense } from "react";
import { ResourcesTabs } from "@/components/web/tools/resources/resources-tab";
import { ResourcesList } from "@/components/web/tools/resources/resources-list";
import type { SearchParams } from "nuqs";
import { resourcesParamsCache } from "@/server/web/shared/schema";

type ResourcesPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ResourcePage({ searchParams }: ResourcesPageProps) {
  const params = resourcesParamsCache.parse(await searchParams);

  return (
    <div className="min-h-screen bg-background/50 flex flex-1 flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-3xl space-y-10 text-center">
        <div className="space-y-4 flex items-center flex-col">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4">The Foundation for your Design System</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">Discover the colors behind any website. Generate a full theme palette and bring it to life instantly with seamless Shadcn theme integration.</p>
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
