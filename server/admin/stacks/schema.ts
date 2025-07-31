import { z } from "zod";
import { type Stack, StackType } from "@prisma/client";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { createSearchParamsCache } from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";

export const stacksTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Stack>().withDefault([{ id: "name", desc: false }]),
  type: parseAsStringEnum(Object.values(StackType)).withDefault(StackType.Tool),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const stacksTableParamsCache = createSearchParamsCache(stacksTableParamsSchema);
export type StacksTableSchema = Awaited<ReturnType<typeof stacksTableParamsCache.parse>>;

export const stackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  type: z.enum(["Language", "Framework", "Library", "Tool", "SaaS", "Cloud", "ETL", "Analytics", "DB", "Hosting", "API", "Storage", "Monitoring", "Messaging", "App", "Network"]).default("Language"), // sesuaikan StackType kamu
  description: z.string().optional(),
  website: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
});

export type StackSchema = z.infer<typeof stackSchema>;
