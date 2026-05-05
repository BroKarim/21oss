import { createOpenRouterEmbedding, SEARCH_EMBEDDING_MODEL } from "@/lib/ai/openrouter";
import type { SearchEnrichment, SearchEnrichmentInput } from "@/lib/ai/search-enrichment";

function joinParts(parts: Array<string | null | undefined>) {
  return parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part)).join("\n");
}

export function buildSearchEmbeddingInput(input: SearchEnrichmentInput, enrichment?: Partial<SearchEnrichment>) {
  const stackNames = input.stacks?.map((stack) => stack.name).join(", ") || "";

  return joinParts([
    `name: ${input.name}`,
    input.tagline ? `tagline: ${input.tagline}` : null,
    input.description ? `description: ${input.description}` : null,
    stackNames ? `stacks: ${stackNames}` : null,
    input.templateType ? `templateType: ${input.templateType}` : null,
    enrichment?.summary ? `summary: ${enrichment.summary}` : null,
    enrichment?.keywords?.length ? `keywords: ${enrichment.keywords.join(", ")}` : null,
    enrichment?.useCases?.length ? `useCases: ${enrichment.useCases.join(", ")}` : null,
    enrichment?.features?.length ? `features: ${enrichment.features.join(", ")}` : null,
  ]);
}

export async function generateSearchEmbedding(input: string) {
  return createOpenRouterEmbedding({
    input,
    title: "Template Search Embedding",
    model: SEARCH_EMBEDDING_MODEL,
  });
}
