export type TemplateSearchDocument = {
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
  publishedAt: string | null;
  updatedAt: string;
  lastCommitDate: string | null;
  stacks: string[];
  stackSlugs: string[];
  searchSummary: string | null;
  searchKeywords: string[];
  searchUseCases: string[];
  searchAudiences: string[];
  searchFeatures: string[];
  searchStyleTags: string[];
  searchSynonyms: string[];
  searchLocales: string[];
  embedding?: number[];
  popularityScore?: number;
  freshnessScore?: number;
};

export type TemplateSearchMetadataSource = {
  searchSummary?: string | null;
  searchKeywords?: string[];
  searchUseCases?: string[];
  searchAudiences?: string[];
  searchFeatures?: string[];
  searchStyleTags?: string[];
  searchSynonyms?: string[];
  searchLocales?: string[];
  embedding?: number[];
};

export type TemplateSearchFilters = {
  templateType?: string | null;
  stackSlugs?: string[];
};

export type TemplateSearchParams = {
  query: string;
  page?: number;
  limit?: number;
  filters?: TemplateSearchFilters;
};
