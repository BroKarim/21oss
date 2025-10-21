import { db } from "@/services/db";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) notFound();

  const curatedList = await db.curatedList.findUnique({
    where: { url: slug },
    select: { title: true, description: true },
  });

  if (!curatedList) notFound();

  const title = curatedList.title;
  const description = curatedList.description ?? "Explore this curated list.";
  const ogImageUrl = `/list/${slug}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/list/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CuratedListRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/#${slug}`);
  return null;
}
