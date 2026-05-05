import "server-only";

const QUERY_NORMALIZATIONS: Array<[RegExp, string]> = [
  [/\be-?commerce\b/g, "ecommerce"],
  [/\beccomerce\b/g, "ecommerce"],
  [/\becommer\b/g, "ecommerce"],
  [/\btempate\b/g, "template"],
];

export function normalizeSearchQuery(query: string): string {
  let normalized = query.trim().toLowerCase().replace(/\s+/g, " ");

  for (const [pattern, replacement] of QUERY_NORMALIZATIONS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}
