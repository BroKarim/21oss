import type { CuratedList } from "@prisma/client";
import { createSearchParamsCache, parseAsString, parseAsInteger,   parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";

export const curatedListsTableParamsSchema = {
  title: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<CuratedList>().withDefault([{ id: "title", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const curatedListsTableParamsCache = createSearchParamsCache(curatedListsTableParamsSchema);

export type CuratedListsTableSchema = Awaited<ReturnType<typeof curatedListsTableParamsCache.parse>>;

export const curatedListSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["gallery", "favicon", "slider", "carousel"]).default("gallery"),
  tools: z.array(z.string()).optional(),
});

export type CuratedListSchema = z.infer<typeof curatedListSchema>;
