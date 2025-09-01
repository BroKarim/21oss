// schema.ts

import { type AwesomeList, RepoStatus, AwesomeCategory } from "@prisma/client";
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";

export const awesomeListTableParamsSchema = {
  name: parseAsString.withDefault(""),
  owner: parseAsString.withDefault(""),
  sort: getSortingStateParser<AwesomeList>().withDefault([{ id: "createdAt", desc: true }]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  category: parseAsArrayOf(z.nativeEnum(AwesomeCategory)).withDefault([]),
  status: parseAsArrayOf(z.nativeEnum(RepoStatus)).withDefault([]),
};

export const awesomeListTableParamsCache = createSearchParamsCache(awesomeListTableParamsSchema);

export type AwesomeListTableSchema = Awaited<ReturnType<typeof awesomeListTableParamsCache.parse>>;

export const awesomeListSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  repositoryUrl: z.string().url("Repository URL must be a valid URL"),
  description: z.string().optional().or(z.literal("")),
  stars: z.number().int().min(0).default(0).optional(),
  forks: z.number().int().min(0).default(0).optional(),
  license: z.string().optional().or(z.literal("")),
  owner: z.string().min(1, "Owner is required"),
  contributors: z.string().optional().or(z.literal("")),
  firstCommitDate: z.string().datetime().optional(),
  lastCommitDate: z.string().datetime().optional(),
  status: z.nativeEnum(RepoStatus).default(RepoStatus.Draft),
  category: z.nativeEnum(AwesomeCategory).default(AwesomeCategory.Programming),
});

export type AwesomeListSchema = z.infer<typeof awesomeListSchema>;
