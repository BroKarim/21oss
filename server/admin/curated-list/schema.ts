import type { CuratedList } from "@prisma/client";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";

export const curatedListsTableParamsSchema = {
  title: parseAsString.withDefault(""),
  sort: getSortingStateParser<CuratedList>().withDefault([{ id: "title", desc: false }]),
};

export const curatedListsTableParamsCache = createSearchParamsCache(curatedListsTableParamsSchema);

export type CuratedListsTableSchema = Awaited<ReturnType<typeof curatedListsTableParamsCache.parse>>;

export const curatedListSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["gallery", "favicon", "slider"]).default("gallery"),
  tools: z.array(z.string()).optional(), // array of Tool IDs
});

export type CuratedListSchema = z.infer<typeof curatedListSchema>;
