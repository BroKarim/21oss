import { notFound } from "next/navigation";
import { getCuratedListByUrl } from "@/server/web/curated-lists/actions";
import Link from "next/link";
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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CuratedListPage(props: PageProps) {
  const { slug } = await props.params;

  const list = await getCuratedListByUrl(slug);

  if (!list) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden pb-20">
      {/* --- BAGIAN 1: HEADER CURATED LIST --- */}
      <div className="bg-neutral-50/50 dark:bg-neutral-900/20 border-b py-12 mb-10">
        <div className="container px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{list.title}</h1>
          {list.description && <p className="text-lg text-muted-foreground leading-relaxed">{list.description}</p>}
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 font-medium">
            <span className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{list.tools.length} Tools</span>
            <span>Updated {new Date(list.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* --- BAGIAN 2: DAFTAR TOOLS (Looping UI ToolPage) --- */}
      <div className="container space-y-16 px-4 sm:px-6 lg:px-8">
        {list.tools.map((tool, index) => (
          <div key={tool.id} className="relative">
            {/* Penanda Nomor Urut (Opsional, agar terlihat seperti list urutan) */}
            <div className="absolute -left-4 top-0 hidden xl:block text-6xl font-black text-neutral-100 dark:text-neutral-800 -z-10 select-none">#{index + 1}</div>

            {/* --- REUSE UI TOOL PAGE DISINI --- */}
            <Section className="overflow-hidden border rounded-xl bg-background/50 p-6 shadow-sm">
              <Section.Content className="max-md:contents">
                <div className="flex flex-1 flex-col items-start space-y-6 max-md:order-1">
                  {/* Tool Header */}
                  <div className="flex w-full flex-col items-start space-y-4">
                    <Stack className="w-full items-center">
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

                  {/* Tech Stack */}
                  <div className="flex w-full flex-col space-y-3">
                    <Stack size="lg" direction="column" className="space-y-2">
                      <Note className="text-sm font-medium text-muted-foreground">Tech Stack:</Note>

                      <ToolStacks stacks={tool.stacks || []} />
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
                    {/* Link ke Detail Page Tool Asli */}
                    <Button variant="outline" asChild>
                      <Link href={`/${tool.slug}`}>View Details</Link>
                    </Button>
                  </Stack>
                </div>
              </Section.Content>

              {/* Sidebar Repo Info */}
              <Section.Sidebar className="max-md:contents">
                <div className="max-md:order-3 pt-6 md:pt-0">
                  <RepositoryDetails showcase={tool} />
                </div>
              </Section.Sidebar>
            </Section>

            {/* Screenshots (Ditaruh di bawah Section info) */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <div className="w-full mt-6">
                <div className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] rounded-lg overflow-hidden border">
                  <MediaViewer items={tool.screenshots.map((s) => s.imageUrl)} className="w-full h-full" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
