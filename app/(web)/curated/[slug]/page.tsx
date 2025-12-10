import { notFound } from "next/navigation";
import { getCuratedListByUrl } from "@/server/web/curated-lists/actions";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button-shadcn";
import { IntroDescription } from "@/components/ui/intro";
import { FaviconImage } from "@/components/ui/favicon";
import { ToolStacks } from "@/components/web/tools/tool-stacks";
import { Note } from "@/components/ui/note";
import { RepositoryDetails } from "@/components/web/repository-detail";
import { MediaViewer } from "@/components/web/media-viewer";
import { Section } from "@/components/ui/section";
import { Stack } from "@/components/ui/stack";
import { H2 } from "@/components/ui/heading";
import { ShareLink } from "@/components/web/share-link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CuratedListPage(props: PageProps) {
  const { slug } = await props.params;

  const list = await getCuratedListByUrl(slug);

  if (!list) {
    notFound();
  }

  const formattedDate = new Date(list.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex w-full max-w-7xl mx-auto flex-col items-center justify-center overflow-x-hidden pb-20">
      <div className="w-full  mx-auto p-6 pt-10">
        <div className="text-sm text-neutral-500 flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-neutral-300 font-medium truncate max-w-[300px]">{list.title}</span>
        </div>

        {/* Title & Meta */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-100 mb-3 tracking-tight">{list.title}</h1>
        <p className="text-sm text-neutral-500 mb-10">
          Created at {formattedDate} • Updated {new Date(list.updatedAt).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="text-neutral-300 leading-relaxed text-[17px] space-y-6 whitespace-pre-wrap">
              {list.description ? <p>{list.description}</p> : <p className="italic text-neutral-500">No description provided for this collection.</p>}
            </div>

            <ShareLink slug={list.url} />
          </div>

          <Link href={siteConfig.links.thread} target="_blank" className="block hover:opacity-90 transition-opacity">
            <Card className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 h-fit sticky top-24">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-neutral-500  uppercase tracking-wider font-semibold">Curated by</p>

                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`${siteConfig.links.github}.png`} alt={siteConfig.author} />
                      <AvatarFallback>{siteConfig.author.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-sm text-neutral-200">{siteConfig.author}</p>
                      <p className="text-neutral-500 text-xs">@{siteConfig.author}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="container space-y-16 px-4 sm:px-6 lg:px-8">
        {list.tools.map((tool, index) => (
          <div key={tool.id} className="relative">
            <Section className="overflow-hidden  rounded-xl bg-background/50 p-6 shadow-sm">
              {/* Tool Info */}
              <Section.Content className="max-md:contents">
                <div className="flex flex-1 flex-col items-start space-y-6 max-md:order-1">
                  <div className="flex w-full flex-col items-start space-y-4">
                    <Stack className="w-full items-center">
                      <div className=" text-4xl font-medium text-neutral-100 dark:text-neutral-800 -z-10 select-none">#{index + 1}</div>
                      <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-10 flex-shrink-0 sm:size-12" />
                      <Stack className="flex-1 min-w-0">
                        <Link href={`/${tool.slug}`} className="hover:underline">
                          <H2 as="h2" className="truncate text-xl sm:text-2xl font-bold">
                            {tool.name}
                          </H2>
                        </Link>
                      </Stack>
                    </Stack>

                    {tool.description && <IntroDescription className="text-sm sm:text-base leading-relaxed line-clamp-3">{tool.description}</IntroDescription>}
                  </div>

                  <div className="flex w-full flex-col space-y-3">
                    <Stack size="lg" direction="column" className="space-y-2">
                      <Note className="text-sm font-medium text-muted-foreground">Tech Stack:</Note>
                      <ToolStacks stacks={tool.stacks || []} />
                    </Stack>
                  </div>

                  <Stack className="w-full flex-col gap-3 sm:flex-row sm:gap-4">
                    {tool.websiteUrl && (
                      <Button asChild>
                        <Link href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                          Visit {tool.name}
                        </Link>
                      </Button>
                    )}

                    <Button variant="outline" asChild>
                      <Link href={`/${tool.slug}`}>View Details</Link>
                    </Button>
                  </Stack>

                  {tool.screenshots && tool.screenshots.length > 0 && (
                    <div className="w-full mt-6">
                      <div className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] rounded-lg overflow-hidden border">
                        <MediaViewer items={tool.screenshots.map((s) => s.imageUrl)} className="w-full h-full" />
                      </div>
                    </div>
                  )}
                </div>
              </Section.Content>

              {/* Sidebar Repo Info */}
              <Section.Sidebar className="max-md:contents">
                <div className="max-md:order-3 pt-6 md:pt-0">
                  <RepositoryDetails showcase={tool} />
                </div>
              </Section.Sidebar>
            </Section>
          </div>
        ))}
      </div>
    </div>
  );
}
