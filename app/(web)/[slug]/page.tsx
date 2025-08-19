import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { Button } from "@/components/ui/button-shadcn";
import { H2 } from "@/components/ui/heading";
import Link from "next/link";
import { AdButton } from "@/components/web/ads/ad-button";
import { Stack } from "@/components/ui/stack";
import { Section } from "@/components/ui/section";
import { findTool, findToolSlugs } from "@/server/web/tools/queries";
import { IntroDescription } from "@/components/ui/intro";
import { FaviconImage } from "@/components/ui/favicon";
import { ToolStacks } from "@/components/web/tools/tool-stacks";
import { RelatedTools } from "./related";
import { Note } from "@/components/ui/note";
import { RepositoryDetails } from "@/components/web/repository-detail";
import { ImageGallery } from "@/components/web/image-gallery";

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

  return (
    <>
      <div className="flex w-full flex-col overflow-x-hidden">
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <Section className="overflow-hidden">
            <Section.Content className="max-md:contents">
              <div className="flex flex-1 flex-col items-start space-y-6 max-md:order-1">
                {/* Tool Header */}
                <div className="flex w-full flex-col items-start space-y-4">
                  <Stack className="w-full items-center">
                    <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8 flex-shrink-0 sm:size-10" />
                    <Stack className="flex-1 min-w-0">
                      <H2 as="h1" className="truncate text-xl sm:text-2xl lg:text-3xl">
                        {tool.name}
                      </H2>
                    </Stack>
                  </Stack>

                  {/* Description */}
                  {tool.description && <IntroDescription className="text-sm sm:text-base leading-relaxed">{tool.description}</IntroDescription>}
                </div>

                {/* Tech Stack */}
                <div className="flex w-full flex-col space-y-3">
                  <Stack size="lg" direction="column" className="space-y-2">
                    <Note className="text-sm font-medium text-muted-foreground">Tech Stack:</Note>
                    <ToolStacks stacks={tool.stacks} />
                  </Stack>
                </div>

                {/* Action Buttons */}
                <Stack className="w-full flex-col gap-3 sm:flex-row sm:gap-4">
                  {tool.websiteUrl && (
                    <Button asChild>
                      <Link href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                        Visit {tool.name}
                      </Link>
                    </Button>
                  )}

                  <AdButton type="All" />
                </Stack>
              </div>
            </Section.Content>

            {/* Sidebar */}
            <Section.Sidebar className="max-md:contents">
              <div className="max-md:order-3 ">
                <RepositoryDetails showcase={tool} />
              </div>
            </Section.Sidebar>
          </Section>

          <div className="w-full">
            <div className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] rounded-lg overflow-hidden">
              <ImageGallery items={(tool.screenshots ?? []).map((s) => s.imageUrl)} className="w-full h-full" />
            </div>
          </div>

          <div className="w-full">
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading related tools...</div>
                </div>
              }
            >
              <RelatedTools tool={tool} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
