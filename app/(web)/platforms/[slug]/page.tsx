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
  console.log("PlatformPage: Received props:", props);
  const platform = await getPlatform(props);
  console.log("PlatformPage: Fetched platform:", platform);
  if (!platform) {
    console.error("PlatformPage: No platform found for props:", props);
    return <div>Error: Platform not found</div>;
  }

  const { title, description } = getMetadata(platform);
  console.log("PlatformPage: Metadata:", { title, description });
  return (
    <Intro>
      <IntroTitle>{`${title}`}</IntroTitle>
      <IntroDescription className="max-w-2xl">{description}</IntroDescription>
      <Suspense fallback={<ToolListSkeleton />}>
        <ToolQuery searchParams={props.searchParams} where={{ platforms: { some: { slug: platform.slug } } }} />
      </Suspense>
    </Intro>
  );
}
