import { ToolStatus, ToolType, type Prisma } from "@prisma/client";
import { db } from "@/services/db";
import { buildSearchEmbeddingInput, generateSearchEmbedding } from "@/lib/ai/search-embedding";
import { generateSearchEnrichment, SEARCH_ENRICHMENT_VERSION, type SearchEnrichmentInput } from "@/lib/ai/search-enrichment";
import { mapTemplateToSearchDocument } from "@/lib/meilisearch/documents";
import type { TemplateSearchDocument, TemplateSearchMetadataSource } from "@/lib/meilisearch/types";

const templateSearchSourceInclude = {
  stacks: {
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  },
  searchMetadata: true,
} satisfies Prisma.ToolInclude;

type TemplateSearchSource = Prisma.ToolGetPayload<{
  include: typeof templateSearchSourceInclude;
}>;

function toSearchEnrichmentInput(tool: TemplateSearchSource): SearchEnrichmentInput {
  return {
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    content: tool.content,
    stacks: tool.stacks,
    templateType: tool.templateType,
  };
}

function toMetadataSource(
  metadata: TemplateSearchSource["searchMetadata"],
  embedding?: number[],
): TemplateSearchMetadataSource | null {
  if (!metadata) return null;

  return {
    searchSummary: metadata.searchSummary,
    searchKeywords: metadata.searchKeywords,
    searchUseCases: metadata.searchUseCases,
    searchAudiences: metadata.searchAudiences,
    searchFeatures: metadata.searchFeatures,
    searchStyleTags: metadata.searchStyleTags,
    searchSynonyms: metadata.searchSynonyms,
    searchLocales: metadata.searchLocales,
    searchEmbeddingRef: metadata.searchEmbeddingRef,
    searchScore: metadata.searchScore,
    searchManualBoost: metadata.searchManualBoost,
    embedding,
  };
}

function isMetadataStale(tool: TemplateSearchSource, force = false) {
  if (force) return true;

  const metadata = tool.searchMetadata;
  if (!metadata) return true;
  if (metadata.searchVersion !== SEARCH_ENRICHMENT_VERSION) return true;
  if (!metadata.searchEnrichedAt) return true;
  if (!metadata.searchSummary) return true;
  if (!metadata.searchEmbeddingRef) return true;

  return false;
}

export async function getTemplateSearchSource(toolId: string) {
  return db.tool.findUnique({
    where: { id: toolId },
    include: templateSearchSourceInclude,
  });
}

export async function ensureTemplateSearchMetadata(toolId: string, options?: { force?: boolean }) {
  const tool = await getTemplateSearchSource(toolId);

  if (!tool) {
    throw new Error("Tool not found");
  }

  if (tool.type !== ToolType.Template) {
    throw new Error("Only template tools can be enriched for search");
  }

  const stale = isMetadataStale(tool, options?.force);

  if (!stale && tool.searchMetadata) {
    return {
      tool,
      metadata: tool.searchMetadata,
      refreshed: false,
    };
  }

  const enrichmentInput = toSearchEnrichmentInput(tool);
  const enrichment = await generateSearchEnrichment(enrichmentInput);
  const embeddingInput = buildSearchEmbeddingInput(enrichmentInput, enrichment);
  const embedding = await generateSearchEmbedding(embeddingInput);

  const metadata = await db.toolSearchMetadata.upsert({
    where: { toolId: tool.id },
    create: {
      toolId: tool.id,
      searchSummary: enrichment.summary,
      searchKeywords: enrichment.keywords,
      searchUseCases: enrichment.useCases,
      searchAudiences: enrichment.audiences,
      searchFeatures: enrichment.features,
      searchStyleTags: enrichment.styleTags,
      searchSynonyms: enrichment.synonyms,
      searchLocales: enrichment.locales,
      searchEmbeddingRef: embedding.model,
      searchEnrichedAt: new Date(),
      searchVersion: SEARCH_ENRICHMENT_VERSION,
    },
    update: {
      searchSummary: enrichment.summary,
      searchKeywords: enrichment.keywords,
      searchUseCases: enrichment.useCases,
      searchAudiences: enrichment.audiences,
      searchFeatures: enrichment.features,
      searchStyleTags: enrichment.styleTags,
      searchSynonyms: enrichment.synonyms,
      searchLocales: enrichment.locales,
      searchEmbeddingRef: embedding.model,
      searchEnrichedAt: new Date(),
      searchVersion: SEARCH_ENRICHMENT_VERSION,
    },
  });

  return {
    tool: {
      ...tool,
      searchMetadata: metadata,
    },
    metadata,
    embedding: embedding.embedding,
    refreshed: true,
  };
}

export async function buildTemplateSearchDocument(toolId: string, options?: { force?: boolean }) {
  const prepared = await ensureTemplateSearchMetadata(toolId, options);
  const embedding =
    prepared.embedding ??
    (
      await generateSearchEmbedding(
        buildSearchEmbeddingInput(toSearchEnrichmentInput(prepared.tool), {
          summary: prepared.metadata.searchSummary ?? undefined,
          keywords: prepared.metadata.searchKeywords,
          useCases: prepared.metadata.searchUseCases,
          features: prepared.metadata.searchFeatures,
        }),
      )
    ).embedding;

  const sourceWithEmbedding = {
    ...prepared.tool,
    searchMetadata: toMetadataSource(prepared.metadata, embedding),
  };

  return {
    tool: prepared.tool,
    document: mapTemplateToSearchDocument(sourceWithEmbedding),
    refreshed: prepared.refreshed,
  };
}

export async function buildPublishedTemplateSearchDocuments(options?: { take?: number; force?: boolean }) {
  const take = options?.take ?? 50;

  const templates = await db.tool.findMany({
    where: {
      type: ToolType.Template,
      status: ToolStatus.Published,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take,
    select: {
      id: true,
    },
  });

  const documents: TemplateSearchDocument[] = [];
  let refreshed = 0;

  for (const template of templates) {
    const result = await buildTemplateSearchDocument(template.id, { force: options?.force });
    documents.push(result.document);
    if (result.refreshed) refreshed += 1;
  }

  return {
    documents,
    total: templates.length,
    refreshed,
  };
}
