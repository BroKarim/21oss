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
  publishedAt: Date | null;
  updatedAt: Date;
  lastCommitDate: Date | null;
  stacks?: Array<{ name: string; slug: string }>;
  searchMetadata?: TemplateSearchMetadataSource | null;
  popularityScore?: number;
  freshnessScore?: number;
};

export function mapTemplateToSearchDocument(template: TemplateDocumentSource): TemplateSearchDocument {
  const metadata = template.searchMetadata;

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
    stacks: template.stacks?.map((stack) => stack.name) ?? [],
    stackSlugs: template.stacks?.map((stack) => stack.slug) ?? [],
    searchSummary: metadata?.searchSummary ?? null,
    searchKeywords: metadata?.searchKeywords ?? [],
    searchUseCases: metadata?.searchUseCases ?? [],
    searchAudiences: metadata?.searchAudiences ?? [],
    searchFeatures: metadata?.searchFeatures ?? [],
    searchStyleTags: metadata?.searchStyleTags ?? [],
    searchSynonyms: metadata?.searchSynonyms ?? [],
    searchLocales: metadata?.searchLocales ?? [],
    embedding: metadata?.embedding,
    popularityScore: template.popularityScore,
    freshnessScore: template.freshnessScore,
  };
}
