import "server-only";

export const templateIndexSettings = {
  searchableAttributes: [
    "name",
    "searchKeywords",
    "searchSynonyms",
    "searchUseCases",
    "tagline",
    "searchSummary",
    "description",
    "stacks",
    "searchFeatures",
    "content",
  ],
  filterableAttributes: ["type", "templateType", "stackSlugs", "searchUseCases", "searchAudiences", "searchStyleTags"],
  sortableAttributes: ["stars", "publishedAt", "updatedAt", "lastCommitDate", "popularityScore", "freshnessScore"],
};
