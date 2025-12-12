import { RCategory } from "@prisma/client";
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";

export const resourcesTableParamsSchema = {
  name: parseAsString.withDefault(""),

  sort: getSortingStateParser<any>().withDefault([{ id: "createdAt", desc: true }]),

  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),

  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),

  category: parseAsArrayOf(z.nativeEnum(RCategory)).withDefault([]),
};

export const resourcesTableParamsCache = createSearchParamsCache(resourcesTableParamsSchema);

export type ResourcesTableSchema = Awaited<ReturnType<typeof resourcesTableParamsCache.parse>>;

export const resourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  media: z
    .array(
      z.object({
        value: z.string().url("Must be a valid URL").or(z.literal("")),
      })
    )
    .default([]),
  category: z.nativeEnum(RCategory),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;
