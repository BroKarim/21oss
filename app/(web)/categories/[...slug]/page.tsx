import { lcFirst } from "@primoui/utils";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense, cache } from "react";
import WidgetBanner from "@/components/web/ui/banner";
import { ToolListSkeleton } from "@/components/web/tools/tool-list";
import { metadataConfig } from "@/config/metadata";
import { categoryRedirects } from "@/lib/categories";
import type { CategoryOne } from "@/server/web/categories/payloads";
import Link from "next/link";
import SubcategoryContainer from "@/components/web/tools/subcategories/subcategories-container";
import { findCategoryByPath, findCategorySlugs, getSubcategories } from "@/server/web/categories/queries";
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

  const subcategories = await getSubcategories(category.slug);

  return (
    <>
      <main className={cn("flex flex-1 flex-col")}>
        <div className="container p-4 space-y-6">
          <WidgetBanner />

          {subcategories.length > 1 && (
            <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
              <ul className="flex gap-4 overflow-x-auto py-2 px-1">
                {subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link href={`#${sub.slug}`} className="text-sm hover:underline whitespace-nowrap">
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <Suspense fallback={<ToolListSkeleton />}>
            <Suspense fallback={<ToolListSkeleton />}>
              <SubcategoryContainer subcategories={subcategories} />
            </Suspense>
          </Suspense>
        </div>
      </main>
    </>
  );
}
