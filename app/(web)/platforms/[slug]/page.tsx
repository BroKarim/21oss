// main page : https://github.com/piotrkulpinski/openalternative/blob/main/app/(web)/categories/%5B...slug%5D/page.tsx

import { lcFirst } from "@primoui/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense, cache } from "react";
import { ToolListSkeleton } from "@/components/web/tools/tool-list";
import { Intro, IntroDescription, IntroTitle } from "@/components/ui/intro";
import { metadataConfig } from "@/config/metadata";
import { findPlatformBySlug, findPlatformSlugs } from "@/server/web/platforms/queries";
import { ToolQuery } from "@/components/web/tools/tool-query";
import type { PlatformOne } from "@/server/web/platforms/payloads";
import { cn } from "@/lib/utils";
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

// --- Get platform ---
const getPlatform = cache(async ({ params }: PageProps) => {
  const { slug } = await params;
  const platform = await findPlatformBySlug(slug);

  if (!platform) notFound();

  return platform;
});

// --- Metadata ---
const getMetadata = (platform: PlatformOne): Metadata => {
  const name = platform.slug || `${platform.name} Tools`;

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the best free and open source tools for ${lcFirst(platform.name)}`,
  };
};

export const generateStaticParams = async () => {
  const platforms = await findPlatformSlugs({});
  return platforms.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const platform = await getPlatform(props);
  const url = `/platforms/${platform.slug}`;

  return {
    ...getMetadata(platform),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  };
};

export default async function PlatformPage(props: PageProps) {
  const platform = await getPlatform(props);
  if (!platform) return notFound();

  const { searchParams } = props;

  const platformWhere = {
    platforms: {
      some: { slug: platform.slug },
    },
  };

  const { title, description } = getMetadata(platform);

  return (
    <main className={cn("flex flex-1 flex-col ")}>
      <div className="container p-4">
        <Intro>
          <IntroTitle>{`${title}`}</IntroTitle>
          <IntroDescription className="max-w-2xl">{description}</IntroDescription>
        </Intro>
        <Suspense fallback={<ToolListSkeleton />}>
          <ToolQuery searchParams={searchParams} where={platformWhere} />
        </Suspense>
      </div>
    </main>
  );
}
