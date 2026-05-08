import { ToolType, TemplateType } from "@prisma/client";
import { createSearchParamsCache, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { githubRegex } from "@/lib/github/utils";

const repositoryMessage = "Please enter a valid GitHub repository URL (e.g. https://github.com/owner/name)";

export const repositorySchema = z.string().min(1, "Repository is required").url(repositoryMessage).trim().toLowerCase().regex(githubRegex, repositoryMessage);
const SORT_OPTIONS = ["stars", "latest", "oldest", "name_asc", "name_desc", "forks"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
type SearchParamsObject = Record<string, string | string[] | undefined>;

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

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isToolType(value: string | undefined): value is ToolType | "all" {
  return value === "all" || value === ToolType.Template || value === ToolType.Component || value === ToolType.Asset;
}

function isTemplateType(value: string | undefined): value is TemplateType | "all" {
  return value === "all" || value === TemplateType.Website || value === TemplateType.Mobile || value === TemplateType.Dashboard;
}

function isSortOption(value: string | undefined): value is SortOption {
  return Boolean(value && SORT_OPTIONS.includes(value as SortOption));
}

export function parseResourcesSearchParams(searchParams: SearchParamsObject): ResourcesParams {
  const type = firstValue(searchParams.type);
  const templateType = firstValue(searchParams.templateType);
  const sort = firstValue(searchParams.sort);
  const stack = firstValue(searchParams.stack);
  const q = firstValue(searchParams.q);

  return {
    type: isToolType(type) ? type : "all",
    templateType: isTemplateType(templateType) ? templateType : "all",
    sort: isSortOption(sort) ? sort : null,
    stack: stack ?? "",
    q: q ?? "",
  };
}
