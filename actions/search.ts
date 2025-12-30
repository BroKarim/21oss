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

    // Single optimized query dengan OR untuk semua fields
    const tools = await db.tool.findMany({
      where: {
        status: "Published",
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { tagline: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          {
            stacks: {
              some: {
                name: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
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

// Get random tools for default state
export const getRandomTools = createServerAction().handler(async () => {
  const tools = await db.tool.findMany({
    where: { status: "Published" },
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      tagline: true,
      websiteUrl: true,
      faviconUrl: true,
      screenshots: {
        orderBy: { order: "asc" },
        take: 1,
        select: { imageUrl: true },
      },
    },
  });

  // Shuffle for pseudo-random
  return { tools: tools.sort(() => Math.random() - 0.5) };
});
