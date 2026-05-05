import "server-only";

import type { TemplateSearchDocument, TemplateSearchMetadataSource } from "@/lib/meilisearch/types";

type TemplateDocumentSource = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  content: string | null;
  type: string;
  templateType: string | null;
  websiteUrl: string | null;
  demoUrl: string | null;
  repositoryUrl: string;
  stars: number;
  forks: number;
  pageviews?: number | null;
  publishedAt: Date | null;
  updatedAt: Date;
  lastCommitDate: Date | null;
  stacks?: Array<{ name: string; slug: string }>;
  searchMetadata?: TemplateSearchMetadataSource | null;
  popularityScore?: number;
  freshnessScore?: number;
};

function uniqTextParts(parts: Array<string | null | undefined>): string[] {
  return [...new Set(parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part)))];
}

function computePopularityScore(template: TemplateDocumentSource): number {
  if (typeof template.popularityScore === "number") return template.popularityScore;

  const stars = Math.max(template.stars, 0);
  const forks = Math.max(template.forks, 0);
  const pageviews = Math.max(template.pageviews ?? 0, 0);

  return Number((Math.log10(stars + 1) + Math.log10(forks + 1) * 0.6 + Math.log10(pageviews + 1) * 0.4).toFixed(6));
}

function computeFreshnessScore(template: TemplateDocumentSource): number {
  if (typeof template.freshnessScore === "number") return template.freshnessScore;

  const sourceDate = template.lastCommitDate ?? template.updatedAt;
  const ageInDays = Math.max(0, (Date.now() - sourceDate.getTime()) / (1000 * 60 * 60 * 24));
  const score = 1 / (1 + ageInDays / 30);

  return Number(score.toFixed(6));
}

export function mapTemplateToSearchDocument(template: TemplateDocumentSource): TemplateSearchDocument {
  const metadata = template.searchMetadata;
  const stackNames = template.stacks?.map((stack) => stack.name) ?? [];
  const stackSlugs = template.stacks?.map((stack) => stack.slug) ?? [];
  const allTextParts = uniqTextParts([
    template.name,
    template.slug,
    template.tagline,
    template.description,
    template.content,
    ...stackNames,
    metadata?.searchSummary,
    ...(metadata?.searchKeywords ?? []),
    ...(metadata?.searchUseCases ?? []),
    ...(metadata?.searchAudiences ?? []),
    ...(metadata?.searchFeatures ?? []),
    ...(metadata?.searchStyleTags ?? []),
    ...(metadata?.searchSynonyms ?? []),
    ...(metadata?.searchLocales ?? []),
  ]);
  const allText = allTextParts.join(" ");
  const searchableText = uniqTextParts([
    template.name,
    template.tagline,
    metadata?.searchSummary,
    ...(metadata?.searchKeywords ?? []),
    ...(metadata?.searchUseCases ?? []),
    ...(metadata?.searchSynonyms ?? []),
    ...stackNames,
  ]).join(" ");
  const popularityScore = computePopularityScore(template);
  const freshnessScore = computeFreshnessScore(template);

  return {
    id: template.id,
    name: template.name,
    slug: template.slug,
    tagline: template.tagline,
    description: template.description,
    content: template.content,
    type: template.type,
    templateType: template.templateType,
    websiteUrl: template.websiteUrl,
    demoUrl: template.demoUrl,
    repositoryUrl: template.repositoryUrl,
    stars: template.stars,
    forks: template.forks,
    publishedAt: template.publishedAt?.toISOString() ?? null,
    updatedAt: template.updatedAt.toISOString(),
    lastCommitDate: template.lastCommitDate?.toISOString() ?? null,
    stacks: stackNames,
    stackSlugs,
    searchSummary: metadata?.searchSummary ?? null,
    searchKeywords: metadata?.searchKeywords ?? [],
    searchUseCases: metadata?.searchUseCases ?? [],
    searchAudiences: metadata?.searchAudiences ?? [],
    searchFeatures: metadata?.searchFeatures ?? [],
    searchStyleTags: metadata?.searchStyleTags ?? [],
    searchSynonyms: metadata?.searchSynonyms ?? [],
    searchLocales: metadata?.searchLocales ?? [],
    allText,
    searchableText,
    searchEmbeddingRef: metadata?.searchEmbeddingRef ?? null,
    embedding: metadata?.embedding,
    popularityScore,
    freshnessScore,
    searchScore: metadata?.searchScore ?? popularityScore,
    searchManualBoost: metadata?.searchManualBoost ?? 0,
  };
}
