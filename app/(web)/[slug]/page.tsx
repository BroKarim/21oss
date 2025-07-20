import { notFound } from "next/navigation";
import { cache } from "react";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Section } from "@/components/ui/section";
// import type { ImageObject } from "schema-dts";
import { findTool, findToolSlugs } from "@/server/web/tools/queries";
import { IntroDescription } from "@/components/ui/intro";
// import { FaviconImage } from "@/components/ui/favicon";
import { ToolDisplay } from "@/components/web/tool-display";
import { Note } from "@/components/ui/note";
import { RepositoryDetails } from "@/components/web/repository-detail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params;
  const tool = await findTool({ where: { slug } });
  if (!tool) {
    notFound();
  }
  console.log("TOOL DATA:", JSON.stringify(tool, null, 2)); // ✅ cek apakah flowNodes & screenshots ada

  return tool;
});

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({});
  return tools.map(({ slug }) => ({ slug }));
};

//TODO : buat dlu schem untuk terima image dan link, bias bs getShowvase
export default async function ToolPage(props: PageProps) {
  const tool = await getTool(props);

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
                  web, Android
                </Stack>
                <Stack size="lg" direction="column">
                  <Note>Licenses:</Note>
                  web, Android
                </Stack>
                <Stack size="lg" direction="column">
                  <Note>Stacks:</Note>
                  React, TailwindCSS, RadixUI
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
        <div className="w-full flex h-screen min-h-[500px]">
          <ToolDisplay path={tool.flowNodes ?? []} screenshots={tool.screenshots ?? []} />
        </div>

        {/* gambar */}
        {/* related */}
      </div>
    </>
  );
}
// https://github.com/piotrkulpinski/openalternative/blob/main/app/(web)/%5Bslug%5D/page.tsx
