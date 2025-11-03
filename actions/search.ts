"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { db } from "@/services/db";

export const searchItems = createServerAction()
  .input(
    z.object({
      query: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const { query } = input;

    if (!query || query.trim() === "") {
      return { tools: [], curatedLists: [] };
    }

    const searchQuery = query.trim();

    // Cari Tools
    const tools = await db.tool.findMany({
      where: {
        OR: [{ name: { contains: searchQuery, mode: "insensitive" } }, { tagline: { contains: searchQuery, mode: "insensitive" } }, { description: { contains: searchQuery, mode: "insensitive" } }],
        status: "Published",
      },
      take: 10,
      select: {
        slug: true,
        name: true,
        tagline: true,
        websiteUrl: true,
        faviconUrl: true,
      },
    });

    // Cari CuratedList
    const curatedLists = await db.curatedList.findMany({
      where: {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          {
            tools: {
              some: {
                name: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
        ],
      },
      take: 10,
      select: {
        url: true,
        title: true,
        description: true,
        type: true,
      },
    });

    return { tools, curatedLists };
  });
