// main page : https://github.com/piotrkulpinski/openalternative/blob/main/app/(web)/categories/%5B...slug%5D/page.tsx

import { lcFirst } from "@primoui/utils";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense, cache } from "react";
import { BoltBanner } from "@/components/web/ui/banner";
import { ToolListSkeleton } from "@/components/web/tools/tool-list";
import { metadataConfig } from "@/config/metadata";
import { categoryRedirects } from "@/lib/categories";
import type { CategoryOne } from "@/server/web/categories/payloads";
import { findCategoryByPath, findCategoryDescendants, findCategorySlugs, findCategoryTree } from "@/server/web/categories/queries";
import { ToolQuery } from "@/components/web/tools/tool-query";
import { cn } from "@/lib/utils";
type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<SearchParams>;
};

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params;
  const category = await findCategoryByPath(slug.join("/"));

  if (!category) {
    const categoryRedirect = categoryRedirects.find((c) => c.source === slug.join("/"));

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination}`;
      permanentRedirect(url);
    }

    notFound();
  }

  return category;
});

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`;

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the best free and open source ${lcFirst(category.description ?? "")}`,
  };
};

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({});
  return categories.map(({ fullPath }) => ({ slug: fullPath.split("/") }));
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const category = await getCategory(props);
  const url = `/categories/${category.fullPath}`;

  return {
    ...getMetadata(category),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  };
};

export default async function CategoryPage(props: PageProps) {
  const category = await getCategory(props);

  const [descendants] = await Promise.all([findCategoryDescendants(category.slug), findCategoryTree(category.fullPath)]);
  return (
    <>
      <main className={cn("flex flex-1 flex-col ")}>
        <div className="container space-y-2 p-4">
          <BoltBanner />

          <Suspense fallback={<ToolListSkeleton />}>
            <ToolQuery searchParams={props.searchParams} where={{ categories: { some: { slug: { in: descendants } } } }} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
