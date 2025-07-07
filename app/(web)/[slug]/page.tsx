import { formatDate } from "@primoui/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Section } from "@/components/ui/section";
import type { ImageObject } from "schema-dts";
import { findShowcase, findShowcaseSlugs } from "@/server/web/showcase/queries";
import { IntroDescription } from "@/components/ui/intro";
import { FaviconImage } from "@/components/ui/favicon";
import { Note } from "@/components/ui/note";
import { RepositoryDetails } from "@/components/web/repository-detail";
type PageProps = {
  params: Promise<{ slug: string }>;
};

const getShowcase = cache(async ({ params }: PageProps) => {
  const { slug } = await params;
  const tool = await findShowcase({ where: { slug } });

  if (!tool) {
    notFound();
  }

  return tool;
});

export const generateStaticParams = async () => {
  const showcases = await findShowcaseSlugs({});
  return showcases.map(({ slug }) => ({ slug }));
};

export default async function ShowcasePage(props: PageProps) {
  const showcase = await getShowcase(props);

  const jsonLd: ImageObject[] = [];

  if (showcase.screenshotUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: showcase.screenshotUrl,
      contentUrl: showcase.screenshotUrl,
      width: "1280",
      height: "720",
      caption: `A screenshot of ${showcase.name}`,
    });
  }

  if (showcase.faviconUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: showcase.faviconUrl,
      contentUrl: showcase.faviconUrl,
      width: "144",
      height: "144",
      caption: `A favicon of ${showcase.name}`,
    });
  }

  return (
    <>
      <div className="flex flex-col gap-12">
        <Section>
          <Section.Content>
            <div className="flex flex-1 flex-col items-start gap-6 max-md:order-1 md:gap-8">
              <div className="flex w-full flex-col items-start gap-y-4">
                <Stack className="w-full">
                  <FaviconImage src={showcase.faviconUrl} title={showcase.name} className="size-8" />

                  <Stack className="flex-1">
                    <H2 as="h1" className="truncate">
                      {showcase.name}
                    </H2>
                  </Stack>
                </Stack>

                {showcase.description && <IntroDescription>{showcase.description}</IntroDescription>}
              </div>
              <Stack size="lg" direction="column">
                <Note>Platform:</Note>
                web, Android
              </Stack>

              <Stack className="w-full">
                <Button className="sm:min-w-36" asChild>
                  Visit {showcase.name}
                </Button>
              </Stack>
            </div>
            {/* gambar dan lain2 taru di section content */}
          </Section.Content>
          <Section.Sidebar className="max-md:contents">
            {" "}
            <RepositoryDetails showcase={showcase} className="max-md:order-5" />
          </Section.Sidebar>
        </Section>
      </div>
    </>
  );
}
// https://github.com/piotrkulpinski/openalternative/blob/main/app/(web)/%5Bslug%5D/page.tsx
