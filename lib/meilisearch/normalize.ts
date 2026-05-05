type SearchQueryNormalization = {
  raw: string;
  normalized: string;
  variants: string[];
};

const PHRASE_NORMALIZATIONS: Array<[RegExp, string]> = [
  [/\b(e-?commerce|eccomerce|ecommer|e comerce)\b/g, "ecommerce"],
  [/\b(toko online|online store|shop online)\b/g, "ecommerce website"],
  [/\b(jualan online|buat jualan|untuk jualan|cocok untuk jualan)\b/g, "ecommerce"],
  [/\b(admin panel|panel admin|backoffice)\b/g, "dashboard"],
  [/\b(personal site|personal website|showcase site)\b/g, "portfolio"],
  [/\b(company profile|company website|business website)\b/g, "agency website"],
];

const TOKEN_NORMALIZATIONS = new Map<string, string>([
  ["tempate", "template"],
  ["temlate", "template"],
  ["templte", "template"],
  ["webiste", "website"],
  ["websiet", "website"],
  ["ccok", "cocok"],
  ["cocokk", "cocok"],
  ["ecomerce", "ecommerce"],
  ["eccomerce", "ecommerce"],
  ["ecommer", "ecommerce"],
  ["ecomm", "ecommerce"],
  ["dashbord", "dashboard"],
  ["dashbaord", "dashboard"],
  ["portofolio", "portfolio"],
  ["desainer", "designer"],
  ["jual", "jualan"],
  ["tokoonline", "toko online"],
]);

const NOISE_WORDS = new Set(["best", "bagus", "good", "the", "a", "an"]);

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeWhitespace(value: string) {
  return value.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]+/gu, " ").replace(/\s+/g, " ");
}

function normalizePhrases(value: string) {
  return PHRASE_NORMALIZATIONS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), value);
}

function normalizeTokens(value: string) {
  return value
    .split(" ")
    .map((token) => TOKEN_NORMALIZATIONS.get(token) ?? token)
    .filter((token) => token.length > 0)
    .join(" ");
}

function enrichIntentTokens(tokens: string[]) {
  const expanded = [...tokens];

  if (tokens.includes("ecommerce")) {
    expanded.push("store", "shop");
  }

  if (tokens.includes("portfolio")) {
    expanded.push("personal", "designer");
  }

  if (tokens.includes("dashboard")) {
    expanded.push("admin");
  }

  if (tokens.includes("saas")) {
    expanded.push("software");
  }

  return expanded;
}

export function normalizeSearchQuery(query: string): SearchQueryNormalization {
  const raw = query.trim();
  const cleaned = normalizeWhitespace(raw);
  const phraseNormalized = normalizePhrases(cleaned);
  const tokenNormalized = normalizeTokens(phraseNormalized);

  const normalizedTokens = tokenNormalized
    .split(" ")
    .filter(Boolean)
    .filter((token) => !NOISE_WORDS.has(token));

  const normalized = unique(enrichIntentTokens(normalizedTokens)).join(" ");
  const variants = unique([raw, cleaned, tokenNormalized, normalized]);

  return {
    raw,
    normalized: normalized || cleaned,
    variants,
  };
}

export function buildSearchQuery(query: string): string {
  const normalized = normalizeSearchQuery(query);

  return normalized.variants.join(" ");
}
