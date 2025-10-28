import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/services/db";

type PageProps = {
  params: { slug: string };
};

const BOT_AGENTS = ["Twitterbot", "facebookexternalhit", "LinkedInBot", "Pinterest", "Discordbot", "Threads"];

export default async function CuratedListRedirectPage({ params }: PageProps) {
  const { slug } = await params;

  // Validasi slug exists
  const curatedList = await db.curatedList.findUnique({
    where: { url: slug },
    select: { title: true },
  });

  if (!curatedList) notFound();

  // Check if bot
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isBot = BOT_AGENTS.some((agent) => userAgent.includes(agent));

  if (isBot) {
    return (
      <main>
        <h1>{curatedList.title}</h1>
        <p>Loading curated list...</p>
      </main>
    );
  }

  redirect(`/#${slug}`);
}
