import type { ResourcesParams } from "@/server/web/shared/schema";
import type { TemplateSearchParams } from "@/lib/meilisearch/types";

const TEMPLATE_SEARCH_PAGE_SIZE = 24;

export function hasTemplateSearchQuery(params: Pick<ResourcesParams, "q">) {
  return params.q.trim().length > 0;
}

export function buildTemplateSearchParams(params: Pick<ResourcesParams, "q" | "sort" | "stack" | "templateType">, page = 1): TemplateSearchParams {
  const stackSlugs = params.stack.split(",").filter(Boolean);
  const templateType = params.templateType !== "all" ? params.templateType : null;

  return {
    query: params.q.trim(),
    page,
    limit: TEMPLATE_SEARCH_PAGE_SIZE,
    sort: params.sort ?? "relevance",
    filters:
      templateType || stackSlugs.length
        ? {
            templateType,
            stackSlugs,
          }
        : undefined,
  };
}
