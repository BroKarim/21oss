import { env } from "@/env";
import { tryCatch } from "@/utils/helpers";

export const SEARCH_ENRICHMENT_PRIMARY_MODEL = "deepseek/deepseek-v4-flash";
export const SEARCH_ENRICHMENT_FALLBACK_MODELS = ["openai/gpt-4o-mini", "anthropic/claude-sonnet-4.5"] as const;
export const SEARCH_EMBEDDING_MODEL = "openai/text-embedding-3-small";

type OpenRouterChatResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type OpenRouterEmbeddingResponse = {
  model?: string;
  data?: Array<{
    embedding?: number[];
    index: number;
  }>;
};

function buildHeaders(title: string) {
  return {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": env.NEXT_PUBLIC_SITE_URL,
    "X-Title": title,
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter error [${response.status}]: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function sendOpenRouterChatJson({
  title,
  system,
  prompt,
  primaryModel = SEARCH_ENRICHMENT_PRIMARY_MODEL,
  fallbackModels = [...SEARCH_ENRICHMENT_FALLBACK_MODELS],
  temperature = 0.2,
  maxTokens = 700,
}: {
  title: string;
  system: string;
  prompt: string;
  primaryModel?: string;
  fallbackModels?: string[];
  temperature?: number;
  maxTokens?: number;
}) {
  const { data, error } = await tryCatch(
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: buildHeaders(title),
      body: JSON.stringify({
        model: primaryModel,
        models: fallbackModels,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
    }).then((response) => parseJsonResponse<OpenRouterChatResponse>(response)),
  );

  if (error || !data) {
    throw error ?? new Error("OpenRouter chat request failed");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenRouter returned empty chat content");
  }

  return {
    model: data.model ?? primaryModel,
    content,
  };
}

const MAX_RETRIES = 3;

export async function createOpenRouterEmbedding({
  input,
  title,
  model = SEARCH_EMBEDDING_MODEL,
}: {
  input: string;
  title: string;
  model?: string;
}) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data, error } = await tryCatch(
        fetch("https://openrouter.ai/api/v1/embeddings", {
          method: "POST",
          headers: buildHeaders(title),
          body: JSON.stringify({
            model,
            input,
            encoding_format: "float",
            input_type: "search_document",
          }),
        }).then((response) =>
          parseJsonResponse<OpenRouterEmbeddingResponse>(response),
        ),
      );

      if (error || !data) {
        throw error ?? new Error("OpenRouter embedding request failed");
      }

      const embedding = data.data?.[0]?.embedding;
      if (!embedding?.length) {
        throw new Error("OpenRouter returned empty embedding");
      }

      return {
        model: data.model ?? model,
        embedding,
      };
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES;
      if (isLastAttempt) throw err;
      console.warn(`[embedding] retry ${attempt}/${MAX_RETRIES} after:`, err);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error("Embedding retries exhausted");
}
