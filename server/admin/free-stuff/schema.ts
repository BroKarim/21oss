import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";
import { PerkType } from "@/generated/prisma/client";

export const freeStuffTableParamsSchema = {
  // Search field
  name: parseAsString.withDefault(""),

  // Sorting (default: createdAt desc)
  sort: getSortingStateParser<any>().withDefault([{ id: "createdAt", desc: true }]),

  // Pagination
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),

  // Filters
  type: parseAsArrayOf(z.nativeEnum(PerkType)).withDefault([]),
  isFree: parseAsArrayOf(z.boolean()).withDefault([]),
};

export const freeStuffSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),

  logoUrl: z.string().url().optional().or(z.literal("")),
  value: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  claimUrl: z.string().url().optional().or(z.literal("")),

  type: z.nativeEnum(PerkType),

  tags: z.array(z.string()).optional().default([]),

  isFree: z.boolean().default(false),
  isHot: z.boolean().default(false),
  isNew: z.boolean().default(false),
});
export const freeStuffTableParamsCache = createSearchParamsCache(freeStuffTableParamsSchema);

export type FreeStuffTableSchema = Awaited<ReturnType<typeof freeStuffTableParamsCache.parse>>;
