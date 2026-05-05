import "server-only";

import { getTemplatesIndex } from "@/lib/meilisearch/indexes";
import { buildSearchQuery, normalizeSearchQuery } from "@/lib/meilisearch/normalize";
import type { TemplateSearchParams } from "@/lib/meilisearch/types";

function buildFilterExpressions(filters: TemplateSearchParams["filters"]) {
  const expressions: string[] = [];

  if (filters?.templateType) {
    expressions.push(`templateType = "${filters.templateType}"`);
  }

  if (filters?.stackSlugs?.length) {
    expressions.push(filters.stackSlugs.map((slug) => `stackSlugs = "${slug}"`).join(" OR "));
  }

  return expressions.length > 0 ? expressions : undefined;
}

export async function searchTemplates({ query, page = 1, limit = 24, filters }: TemplateSearchParams) {
  const index = getTemplatesIndex();
  const normalizedQuery = normalizeSearchQuery(query);
  const meiliQuery = buildSearchQuery(query);

  return index.search(meiliQuery, {
    page,
    hitsPerPage: limit,
    filter: buildFilterExpressions(filters),
    matchingStrategy: "all",
    showRankingScore: true,
    attributesToSearchOn: normalizedQuery.normalized === normalizedQuery.raw ? undefined : ["name", "searchKeywords", "searchSynonyms", "searchUseCases", "searchableText", "allText"],
  });
}

export async function searchTemplateSuggestions(query: string, limit = 5) {
  const index = getTemplatesIndex();
  const normalizedQuery = normalizeSearchQuery(query);

  return index.search(normalizedQuery.normalized, {
    limit,
    attributesToRetrieve: ["id", "name", "slug", "tagline"],
  });
}
