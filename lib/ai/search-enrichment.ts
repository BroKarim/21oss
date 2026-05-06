import { z } from "zod";
import { sendOpenRouterChatJson } from "@/lib/ai/openrouter";

export const SEARCH_ENRICHMENT_VERSION = 1;

export const searchEnrichmentSchema = z.object({
  summary: z.string().min(1).max(220),
  keywords: z.array(z.string().min(1).max(50)).max(12),
  useCases: z.array(z.string().min(1).max(50)).max(10),
  audiences: z.array(z.string().min(1).max(50)).max(8),
  features: z.array(z.string().min(1).max(50)).max(12),
  styleTags: z.array(z.string().min(1).max(50)).max(8),
  synonyms: z.array(z.string().min(1).max(50)).max(12),
  locales: z.array(z.string().min(1).max(20)).max(6),
});

export type SearchEnrichment = z.infer<typeof searchEnrichmentSchema>;

export type SearchEnrichmentInput = {
  name: string;
  tagline?: string | null;
  description?: string | null;
  content?: string | null;
  stacks?: Array<{ name: string; slug?: string }>;
  templateType?: string | null;
};

const SYSTEM_PROMPT = `You create search metadata for website templates.

Rules:
- Output valid JSON only.
- Do not hallucinate features not supported by input.
- Prefer short searchable phrases, not long prose.
- Include both English and Indonesian-friendly search language when natural.
- Good for typo-tolerant and intent-driven search.
- If unsure, keep lists short rather than invent details.
- Summary must be one sentence, concise, factual, and searchable.`;

function dedupe(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function buildPrompt(input: SearchEnrichmentInput) {
  const stackNames = input.stacks?.map((stack) => stack.name).join(", ") || "";

  return `Generate search enrichment metadata for this template.

Input:
- name: ${input.name}
- tagline: ${input.tagline ?? ""}
- description: ${input.description ?? ""}
- content: ${input.content ?? ""}
- stacks: ${stackNames}
- templateType: ${input.templateType ?? ""}

Required JSON shape:
{
  "summary": string,
  "keywords": string[],
  "useCases": string[],
  "audiences": string[],
  "features": string[],
  "styleTags": string[],
  "synonyms": string[],
  "locales": string[]
}

Guidance:
- keywords: concrete search terms like "nextjs ecommerce template"
- useCases: user intent like "online store", "saas dashboard"
- audiences: buyer/user type like "founder", "designer", "agency"
- features: visible or implied feature terms only
- styleTags: aesthetic or vibe tags
- synonyms: alternate phrases users may search, including Indo/English mix
- locales: language/market hints like "en", "id", "global" if appropriate`;
}

export async function generateSearchEnrichment(input: SearchEnrichmentInput): Promise<SearchEnrichment> {
  const response = await sendOpenRouterChatJson({
    title: "Template Search Enrichment",
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(input),
  });

  const parsed = searchEnrichmentSchema.parse(JSON.parse(response.content));

  return {
    summary: parsed.summary.trim(),
    keywords: dedupe(parsed.keywords),
    useCases: dedupe(parsed.useCases),
    audiences: dedupe(parsed.audiences),
    features: dedupe(parsed.features),
    styleTags: dedupe(parsed.styleTags),
    synonyms: dedupe(parsed.synonyms),
    locales: dedupe(parsed.locales),
  };
}
