import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/services/db";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: { slug: string };
};

const BOT_AGENTS = ["Twitterbot", "facebookexternalhit", "LinkedInBot", "Pinterest", "Discordbot", "Threads"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
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

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isBot = BOT_AGENTS.some((agent) => userAgent.includes(agent));

  if (isBot) {
    return (
      <main>
        <h1>{params.slug}</h1>
        <p>Loading curated list...</p>
      </main>
    );
  }

  redirect(`/#${slug}`);
}
