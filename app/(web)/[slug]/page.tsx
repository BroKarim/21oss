import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Section } from "@/components/ui/section";
// import type { ImageObject } from "schema-dts";
import { ShareButtons } from "@/components/web/share-button";
import { findTool, findToolSlugs } from "@/server/web/tools/queries";
import { IntroDescription } from "@/components/ui/intro";
// import { FaviconImage } from "@/components/ui/favicon";
import { ToolDisplay } from "@/components/web/tool-display";
import { RelatedTools } from "./related";
import { Note } from "@/components/ui/note";
import { RepositoryDetails } from "@/components/web/repository-detail";
import ImageGallery from "@/components/web/image-gallery";
type PageProps = {
  params: Promise<{ slug: string }>;
};

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params;
  const tool = await findTool({ where: { slug } });
  if (!tool) {
    notFound();
  }

  return tool;
});

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({});
  return tools.map(({ slug }) => ({ slug }));
};

export default async function ToolPage(props: PageProps) {
  const tool = await getTool(props);
  const sampleImages = [
    "https://openlayout-web-storage.s3.us-east-1.amazonaws.com/affilmory/aff-1.png",
    "https://openlayout-web-storage.s3.us-east-1.amazonaws.com/affilmory/aff-col-set.png",
    "https://openlayout-web-storage.s3.us-east-1.amazonaws.com/affilmory/aff-photo-location.png",
  ];

  return (
    <>
      <div className="flex w-full flex-col space-y-4 px-8 py-4">
        <Section>
          <Section.Content className="max-md:contents">
            <div className="flex flex-1 flex-col items-start gap-6 max-md:order-1 md:gap-8 px">
              <div className="flex w-full flex-col items-start gap-y-4">
                <Stack className="w-full">
                  {/* <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" /> */}

                  <Stack className="flex-1">
                    <H2 as="h1" className="truncate">
                      {tool.name}
                    </H2>
                  </Stack>
                </Stack>

                {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
              </div>
              <div className="flex gap-8">
                <Stack size="lg" direction="column">
                  <Note>Platform:</Note>
                  web, Android
                </Stack>
                <Stack size="lg" direction="column">
                  <Note>Category:</Note>
                  {tool.categories?.length > 0 ? (
                    tool.categories.map((category) => (
                      <Link href={category.slug} key={category.slug} className="text-sm">
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm">No categories</span>
                  )}
                </Stack>
                <Stack size="lg" direction="column">
                  <Note>Licenses:</Note>
                  web, Android
                </Stack>
                <Stack size="lg" direction="column">
                  <Note>Stacks:</Note>
                  {tool.stacks && tool.stacks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tool.stacks.map((stack) => (
                        <Link key={stack.id} href={`/stacks/${stack.slug}`} className="px-3 py-1 rounded-md border text-sm hover:bg-muted transition">
                          {stack.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </Stack>
              </div>

              <Stack className="w-full">
                <Button className="sm:min-w-36">Visit {tool.name}</Button>
              </Stack>
            </div>
            {/* gambar dan lain2 taru di section content */}
          </Section.Content>
          <Section.Sidebar className="max-md:contents">
            <RepositoryDetails showcase={tool} className="max-md:order-5" />
          </Section.Sidebar>
        </Section>
        {/* <div className="w-full flex  ">
          <ToolDisplay screenshots={tool.screenshots ?? []} />
        </div> */}
        <div className="w-full flex  min-h-[500px]">
          <ImageGallery images={sampleImages} />
        </div>
        <ShareButtons title="tess" direction="column" className="max-md:order-9" />
        <p>- tinggal tambahin -source (i)-</p>

        <Suspense>
          <RelatedTools tool={tool} />
        </Suspense>
      </div>
    </>
  );
}
