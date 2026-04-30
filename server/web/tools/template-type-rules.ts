export type TemplateBucket = "website" | "mobile" | "dashboard";

export const TEMPLATE_TYPE_RULES_VERSION = "2026-04-23-1";

type ClassifyInput = {
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  repositoryUrl?: string | null;
  stacks?: { slug?: string | null; name?: string | null }[] | null;
};

type Match = { kind: "stack" | "text"; keyword: string };

const MOBILE_STACK_KEYWORDS = [
  "react-native",
  "expo",
  "flutter",
  "android",
  "ios",
  "swift",
  "kotlin",
  "capacitor",
  "ionic",
] as const;

const MOBILE_TEXT_KEYWORDS = [
  "react native",
  "react-native",
  "mobile",
  "expo",
  "flutter",
  "android",
  "ios",
  "apk",
  "ipa",
  "mobile app",
] as const;

const DASHBOARD_TEXT_KEYWORDS = [
  "dashboard",
  "admin",
  "admin panel",
  "backoffice",
  "back office",
  "panel",
  "analytics dashboard",
  "crm",
  "cms",
  "erp",
  "inventory",
  "internal tool",
  "backoffice tool",
  "admin dashboard",
  "saas dashboard",
] as const;

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/[^a-z0-9\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildHaystack(input: ClassifyInput): string {
  return normalizeText(
    [
      input.name,
      input.tagline,
      input.description,
      input.repositoryUrl,
      ...(input.stacks?.map((s) => s.slug || s.name).filter(Boolean) ?? []),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function classifyTemplateBucket(input: ClassifyInput): {
  bucket: TemplateBucket;
  scores: { mobile: number; dashboard: number };
  matched: Match[];
  haystack: string;
} {
  const haystack = buildHaystack(input);
  const matched: Match[] = [];
  let mobileScore = 0;
  let dashboardScore = 0;

  const stackSlugs = new Set(
    (input.stacks ?? [])
      .map((s) => normalizeText(s.slug || ""))
      .filter(Boolean)
  );

  for (const kw of MOBILE_STACK_KEYWORDS) {
    if (stackSlugs.has(kw)) {
      mobileScore += 2;
      matched.push({ kind: "stack", keyword: kw });
    }
  }

  for (const kw of MOBILE_TEXT_KEYWORDS) {
    if (haystack.includes(kw)) {
      mobileScore += 1;
      matched.push({ kind: "text", keyword: kw });
    }
  }

  for (const kw of DASHBOARD_TEXT_KEYWORDS) {
    if (haystack.includes(kw)) {
      dashboardScore += kw === "admin" || kw === "panel" ? 1 : 2;
      matched.push({ kind: "text", keyword: kw });
    }
  }

  if (mobileScore >= 1) {
    return { bucket: "mobile", scores: { mobile: mobileScore, dashboard: dashboardScore }, matched, haystack };
  }

  if (dashboardScore >= 2) {
    return { bucket: "dashboard", scores: { mobile: mobileScore, dashboard: dashboardScore }, matched, haystack };
  }

  return { bucket: "website", scores: { mobile: mobileScore, dashboard: dashboardScore }, matched, haystack };
}
