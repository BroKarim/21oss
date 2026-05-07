import { ToolType, TemplateType } from "@prisma/client";
import { createSearchParamsCache, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { githubRegex } from "@/lib/github/utils";

const repositoryMessage = "Please enter a valid GitHub repository URL (e.g. https://github.com/owner/name)";

export const repositorySchema = z.string().min(1, "Repository is required").url(repositoryMessage).trim().toLowerCase().regex(githubRegex, repositoryMessage);
const SORT_OPTIONS = ["stars", "latest", "oldest", "name_asc", "name_desc", "forks"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export const resourcesFilterParamsSchema = {
  type: parseAsStringEnum<ToolType | "all">(["all", ToolType.Template, ToolType.Component, ToolType.Asset]).withDefault("all"),
  templateType: parseAsStringEnum<TemplateType | "all">(["all", TemplateType.Website, TemplateType.Mobile, TemplateType.Dashboard]).withDefault("all"),
  sort: parseAsStringEnum<SortOption>([...SORT_OPTIONS]),
  stack: parseAsString.withDefault(""),
  q: parseAsString.withDefault(""),
};

export const resourcesParamsCache = createSearchParamsCache(resourcesFilterParamsSchema);

// schema.ts
export type ResourcesParams = Awaited<ReturnType<typeof resourcesParamsCache.parse>>;
