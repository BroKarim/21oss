import type { SearchParams } from "nuqs/server";
import { ToolType, AdType } from "@prisma/client";
import type { Metadata } from "next";
import { HomeClient } from "./_components/home-client";
import { resourcesParamsCache } from "@/server/web/shared/schema";
import { getResources, getStackFilters, getResourcesCount } from "@/server/web/tools/actions";
import { getActiveAds, getActiveAdsByType } from "@/server/web/ads/queries";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

const homeTitle = "Open-Source Templates, Components, Tools & Assets";
const homeDescription =
  "Explore curated open-source templates, UI components, icons, tools, and assets for developers and makers who want to build and ship faster.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  openGraph: {
    title: `${homeTitle} · ${siteConfig.name}`,
    description: homeDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "21OSS curated open-source resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${homeTitle} · ${siteConfig.name}`,
    description: homeDescription,
    images: [siteConfig.ogImage],
  },
};

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const params = resourcesParamsCache.parse(await searchParams);
  const [stacks, result, ads, totalCount, toolPageAds] = await Promise.all([
    getStackFilters(),
    getResources({ ...params, type: ToolType.Template }),
    getActiveAds(),
    getResourcesCount({ ...params, type: ToolType.Template }),
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
      ads={ads}
      title={homeTitle}
      description={homeDescription}
    />
  );
}
