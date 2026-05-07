import "server-only";

import { Prisma, ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { ToolListPayload, type ToolList } from "@/server/web/tools/payloads";
import { hasMeiliConfig } from "@/lib/meilisearch/client";
import { getTemplatesIndex } from "@/lib/meilisearch/indexes";
import { buildSearchQuery, normalizeSearchQuery } from "@/lib/meilisearch/normalize";
import type { TemplateSearchParams, TemplateSearchSort, TemplateSearchSuggestion } from "@/lib/meilisearch/types";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

const MEILI_SORTS: Partial<Record<Exclude<TemplateSearchSort, "oldest" | "relevance">, string[]>> = {
  stars: ["stars:desc", "searchScore:desc", "freshnessScore:desc"],
  latest: ["lastCommitDate:desc", "updatedAt:desc", "stars:desc"],
  name_asc: ["name:asc"],
  name_desc: ["name:desc"],
  forks: ["forks:desc", "stars:desc"],
};

export type TemplateSearchResult = {
  items: ToolList[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
  query: string;
  normalizedQuery: string;
  source: "meili" | "postgres";
  fallbackReason: string | null;
};

function clampPage(page?: number) {
  return Math.max(1, Number.isFinite(page) ? Math.trunc(page!) : 1);
}

function clampLimit(limit?: number) {
  const safeLimit = Number.isFinite(limit) ? Math.trunc(limit!) : DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, safeLimit));
}

function escapeFilterValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildFilterExpressions(filters: TemplateSearchParams["filters"]) {
  const expressions: string[] = [];

  if (filters?.templateType) {
    expressions.push(`templateType = "${escapeFilterValue(filters.templateType)}"`);
  }

  if (filters?.stackSlugs?.length) {
    expressions.push(filters.stackSlugs.map((slug) => `stackSlugs = "${escapeFilterValue(slug)}"`).join(" OR "));
  }

  return expressions.length > 0 ? expressions : undefined;
}

function buildMeiliSort(sort?: TemplateSearchSort | null) {
  if (!sort || sort === "relevance" || sort === "oldest") {
    return undefined;
  }

  return MEILI_SORTS[sort];
}

function buildSearchOrderBy(sort?: TemplateSearchSort | null, hasQuery?: boolean): Prisma.ToolOrderByWithRelationInput[] {
  switch (sort) {
    case "latest":
      return [{ lastCommitDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }];
    case "oldest":
      return [{ firstCommitDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }];
    case "name_asc":
      return [{ name: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "name_desc":
      return [{ name: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    case "forks":
      return [{ forks: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    case "stars":
      return [{ stars: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    default:
      if (hasQuery) {
        return [{ stars: "desc" }, { lastCommitDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }];
      }

      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

function buildFallbackWhere(params: { query: string; filters?: TemplateSearchParams["filters"] }) {
  const normalizedQuery = normalizeSearchQuery(params.query);
  const phrases = [...new Set([normalizedQuery.raw, normalizedQuery.normalized, ...normalizedQuery.variants].map((value) => value.trim()).filter(Boolean))];
  const tokens = [...new Set(normalizedQuery.normalized.split(" ").map((token) => token.trim()).filter(Boolean))];

  const textClauses: Prisma.ToolWhereInput[] = [];

  for (const phrase of phrases) {
    textClauses.push(
      { name: { contains: phrase, mode: "insensitive" } },
      { slug: { contains: phrase, mode: "insensitive" } },
      { tagline: { contains: phrase, mode: "insensitive" } },
      { description: { contains: phrase, mode: "insensitive" } },
      { content: { contains: phrase, mode: "insensitive" } },
      { stacks: { some: { OR: [{ name: { contains: phrase, mode: "insensitive" } }, { slug: { contains: phrase, mode: "insensitive" } }] } } },
    );
  }

  if (tokens.length) {
    textClauses.push(
      { searchMetadata: { is: { searchKeywords: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchSynonyms: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchUseCases: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchAudiences: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchFeatures: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchStyleTags: { hasSome: tokens } } } },
      { searchMetadata: { is: { searchLocales: { hasSome: tokens } } } },
    );
  }

  return {
    status: ToolStatus.Published,
    type: ToolType.Template,
    ...(params.filters?.templateType ? { templateType: params.filters.templateType } : {}),
    ...(params.filters?.stackSlugs?.length
      ? {
          stacks: {
            some: {
              slug: {
                in: params.filters.stackSlugs,
              },
            },
          },
        }
      : {}),
    ...(textClauses.length ? { OR: textClauses } : {}),
  } satisfies Prisma.ToolWhereInput;
}

async function hydrateToolsByIds(ids: string[]) {
  if (!ids.length) return [];

  const tools = await db.tool.findMany({
    where: {
      id: { in: ids },
      status: ToolStatus.Published,
      type: ToolType.Template,
    },
    select: ToolListPayload,
  });

  const toolById = new Map(tools.map((tool) => [tool.id, tool]));
  return ids.map((id) => toolById.get(id)).filter((tool): tool is ToolList => Boolean(tool));
}

async function searchTemplatesFromPostgres(params: TemplateSearchParams, fallbackReason: string): Promise<TemplateSearchResult> {
  const page = clampPage(params.page);
  const limit = clampLimit(params.limit);
  const normalizedQuery = normalizeSearchQuery(params.query);
  const where = buildFallbackWhere({ query: params.query, filters: params.filters });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    db.tool.findMany({
      where,
      orderBy: buildSearchOrderBy(params.sort, Boolean(normalizedQuery.normalized)),
      select: ToolListPayload,
      skip,
      take: limit,
    }),
    db.tool.count({ where }),
  ]);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    query: normalizedQuery.raw,
    normalizedQuery: normalizedQuery.normalized,
    source: "postgres",
    fallbackReason,
  };
}

export async function searchTemplates(params: TemplateSearchParams): Promise<TemplateSearchResult> {
  const page = clampPage(params.page);
  const limit = clampLimit(params.limit);
  const normalizedQuery = normalizeSearchQuery(params.query);

  if (params.sort === "oldest") {
    return searchTemplatesFromPostgres({ ...params, page, limit }, "unsupported_meili_sort:oldest");
  }

  if (!hasMeiliConfig()) {
    return searchTemplatesFromPostgres({ ...params, page, limit }, "missing_meili_config");
  }

  try {
    const response = await getTemplatesIndex().search(buildSearchQuery(params.query), {
      page,
      hitsPerPage: limit,
      filter: buildFilterExpressions(params.filters),
      matchingStrategy: "all",
      showRankingScore: true,
      sort: buildMeiliSort(params.sort) ?? (!normalizedQuery.normalized ? ["searchScore:desc", "freshnessScore:desc", "stars:desc"] : undefined),
      attributesToSearchOn:
        normalizedQuery.normalized === normalizedQuery.raw
          ? undefined
          : ["name", "searchKeywords", "searchSynonyms", "searchUseCases", "searchableText", "allText"],
    });

    const items = await hydrateToolsByIds(response.hits.map((hit) => hit.id));
    const total = response.totalHits ?? items.length;
    const totalPages = response.totalPages ?? (total > 0 ? Math.ceil(total / limit) : 0);

    return {
      items,
      total,
      page: response.page ?? page,
      limit: response.hitsPerPage ?? limit,
      totalPages,
      nextPage: (response.page ?? page) < totalPages ? (response.page ?? page) + 1 : null,
      query: normalizedQuery.raw,
      normalizedQuery: normalizedQuery.normalized,
      source: "meili",
      fallbackReason: null,
    };
  } catch (error) {
    const reason = `meili_error:${error instanceof Error ? error.name : "unknown"}`;
    console.warn("[meili-search] falling back to postgres", reason);
    return searchTemplatesFromPostgres({ ...params, page, limit }, reason);
  }
}

export async function searchTemplateSuggestions(query: string, limit = 5): Promise<TemplateSearchSuggestion[]> {
  const safeLimit = Math.min(10, Math.max(1, Math.trunc(limit)));
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery.normalized) {
    return [];
  }

  if (!hasMeiliConfig()) {
    const rows = await db.tool.findMany({
      where: buildFallbackWhere({ query, filters: undefined }),
      orderBy: [{ stars: "desc" }, { lastCommitDate: { sort: "desc", nulls: "last" } }, { id: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        templateType: true,
      },
      take: safeLimit,
    });

    return rows;
  }

  try {
    const index = getTemplatesIndex();
    const result = await index.search(normalizedQuery.normalized, {
      limit: safeLimit,
      attributesToRetrieve: ["id", "name", "slug", "tagline", "templateType"],
    });

    return result.hits.map((hit) => ({
      id: hit.id,
      name: hit.name,
      slug: hit.slug,
      tagline: hit.tagline,
      templateType: hit.templateType,
    }));
  } catch {
    const rows = await db.tool.findMany({
      where: buildFallbackWhere({ query, filters: undefined }),
      orderBy: [{ stars: "desc" }, { lastCommitDate: { sort: "desc", nulls: "last" } }, { id: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        templateType: true,
      },
      take: safeLimit,
    });

    return rows;
  }
}
