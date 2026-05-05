import { Prisma } from "@prisma/client";
import { stackManyPayload } from "../stacks/payloads";

export const ToolListPayload = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  repositoryUrl: true,
  tagline: true,
  stars: true,
  forks: true,
  lastCommitDate: true,
  faviconUrl: true,
  searchMetadata: {
    select: {
      searchSummary: true,
      searchKeywords: true,
      searchUseCases: true,
      searchAudiences: true,
      searchFeatures: true,
      searchStyleTags: true,
      searchSynonyms: true,
      searchLocales: true,
      searchEmbeddingRef: true,
      searchScore: true,
      searchManualBoost: true,
      searchEnrichedAt: true,
      searchVersion: true,
    },
  },
  stacks: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  },
  screenshots: {
    select: {
      imageUrl: true,
      order: true,
    },
    where: { order: 0 },
    take: 1,
  },
});

export type ToolList = Prisma.ToolGetPayload<{ select: typeof ToolListPayload }>;
