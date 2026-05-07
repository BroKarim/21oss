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

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const withoutCodeFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const firstBrace = withoutCodeFence.indexOf("{");
  const lastBrace = withoutCodeFence.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return withoutCodeFence.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
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
  const fallbackModels = ["openai/gpt-4o-mini", "anthropic/claude-sonnet-4.5"] as const;

  for (let attempt = 0; attempt <= fallbackModels.length; attempt++) {
    const model = attempt === 0
      ? "deepseek/deepseek-v4-flash"
      : fallbackModels[attempt - 1];

    try {
      const response = await sendOpenRouterChatJson({
        title: "Template Search Enrichment",
        system: SYSTEM_PROMPT,
        prompt: buildPrompt(input),
        primaryModel: model,
      });

      const parsed = JSON.parse(extractJsonObject(response.content)) as Record<string, unknown>;

      return searchEnrichmentSchema.parse({
        summary: String(parsed.summary ?? "").trim().slice(0, 220),
        keywords: dedupe(toStringArray(parsed.keywords)).slice(0, 12),
        useCases: dedupe(toStringArray(parsed.useCases)).slice(0, 10),
        audiences: dedupe(toStringArray(parsed.audiences)).slice(0, 8),
        features: dedupe(toStringArray(parsed.features)).slice(0, 12),
        styleTags: dedupe(toStringArray(parsed.styleTags)).slice(0, 8),
        synonyms: dedupe(toStringArray(parsed.synonyms)).slice(0, 12),
        locales: dedupe(toStringArray(parsed.locales)).slice(0, 6),
      });
    } catch (error) {
      const isLastAttempt = attempt === fallbackModels.length;
      if (isLastAttempt) {
        throw error;
      }
      const nextModel = fallbackModels[attempt];
      console.warn(`[search-enrich] ${model} failed, retry with ${nextModel}:`, error);
    }
  }

  throw new Error("All models exhausted");
}
