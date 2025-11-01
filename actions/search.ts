"use server";

import { db } from "@/services/db";

export async function searchItems(query: string) {
  if (!query || query.trim() === "") return { tools: [], curatedLists: [] };

  // Cari Tools
  const tools = await db.tool.findMany({
    where: {
      OR: [{ name: { contains: query, mode: "insensitive" } }, { tagline: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }],
      status: "Published",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      faviconUrl: true,
      screenshotUrl: true,
      websiteUrl: true,
    },
  });

  // Cari CuratedList
  const curatedLists = await db.curatedList.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          tools: {
            some: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        },
      ],
    },
    take: 10,
    select: {
      id: true,
      title: true,
      url: true,
      description: true,
      type: true,
    },
  });

  return { tools, curatedLists };
}
