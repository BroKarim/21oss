import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgBase } from "@/components/web/og/og-base";
import { db } from "@/services/db";

// Metadata OG image
export const contentType = "image/png";
export const alt = "Curated List OpenGraph image";
export const size = { width: 1200, height: 630 };

type PageProps = {
  searchParams?: { slug?: string };
};

// /opengraph-image?slug=ai-tools-for-startups
export default async function Image({ searchParams }: PageProps) {
  const slug = searchParams?.slug;
  if (!slug) notFound();

  const curatedList = await db.curatedList.findUnique({
    where: { url: slug },
    select: {
      title: true,
      description: true,
    },
  });

  if (!curatedList) {
    notFound();
  }

  return new ImageResponse(<OgBase name={curatedList.title} description={curatedList.description ?? "Explore this curated list of open source tools."} />, {
    width: 1200,
    height: 630,
  });
}
