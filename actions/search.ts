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
      return { tools: [] };
    }
    const searchQuery = query.trim();

    const tools = await db.tool.findMany({
      where: {
        status: "Published",
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { tagline: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        tagline: true,
        websiteUrl: true,
        screenshots: {
          orderBy: { order: "asc" },
          take: 1,
          select: { imageUrl: true },
        },
      },
    });

    return { tools };
  });

export const getRandomTools = createServerAction().handler(async () => {
  const allIds = await db.tool.findMany({
    where: { status: "Published" },
    select: { id: true },
  });

  const randomIds = allIds
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((t) => t.id);

  const tools = await db.tool.findMany({
    where: { id: { in: randomIds } },
    select: {
      id: true,
      name: true,
      tagline: true,
      websiteUrl: true,
      screenshots: {
        orderBy: { order: "asc" },
        take: 1,
        select: { imageUrl: true },
      },
    },
  });

  return { tools };
});
