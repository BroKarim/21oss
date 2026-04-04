"use server";

import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { findTweetCandidates } from "./queries";
import { db } from "@/services/db";
import { env } from "@/env";
import { tryCatch } from "@/utils/helpers";

const generateTweetSchema = z.object({
  count: z.number().min(1).max(5).default(3),
  model: z.string().default("anthropic/claude-sonnet-4.5"),
});

const updateTweetImageSchema = z.object({
  toolId: z.string().min(1),
  imageUrl: z.string().url(),
});

const resetTweetedSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

const buildTweetText = (tool: {
  name: string;
  tagline: string | null;
  description: string | null;
  stars: number;
  forks: number;
  websiteUrl: string | null;
  repositoryUrl: string;
  stacks: { name: string }[];
}) => {
  const stackNames = tool.stacks.slice(0, 4).map((s) => s.name).filter(Boolean);
  const summary = (tool.tagline || tool.description || tool.name).trim();
  const starsLine = `⭐️:${tool.stars.toLocaleString()}`;
  const forksLine = `🔗:${tool.forks.toLocaleString()}`;
  const url = tool.repositoryUrl;

  return [
    summary,
    "",
    starsLine,
    forksLine,
    "",
    stackNames.join(", "),
    url,
  ]
    .filter((line) => line !== undefined && line !== null)
    .join("\n");
};

const pickImageUrl = (tool: { screenshotUrl: string | null; screenshots: { imageUrl: string; order: number }[] }) => {
  const ordered = [...tool.screenshots].sort((a, b) => a.order - b.order);
  return ordered[0]?.imageUrl ?? tool.screenshotUrl ?? null;
};

const TWEET_TEMPLATES = [
  "Template A: Short intro + stack + stars + link",
  "Template B: Benefit-driven (why use it) + stack + link",
  "Template C: Announcement + key feature + stars + link",
];

const buildPrompt = (tool: {
  name: string;
  tagline: string | null;
  description: string | null;
  stars: number;
  forks: number;
  websiteUrl: string | null;
  repositoryUrl: string;
  stacks: { name: string }[];
}, templateLabel: string) => {
  const stackNames = tool.stacks.slice(0, 4).map((s) => s.name).filter(Boolean);
  const summary = tool.tagline || tool.description || "";
  const url = tool.repositoryUrl;

  return `You are a social media copywriter for developer tools.
Create ONE tweet using ${templateLabel}.

Data:
- name: ${tool.name}
- summary: ${summary}
- stacks: ${stackNames.join(", ")}
- stars: ${tool.stars}
- forks: ${tool.forks}
- link: ${url}

Rules:
- 1–2 sentences for the description (paraphrase the summary, make it more engaging).
- Use this exact format:

{DESC}

⭐️:{STARS}
🔗:{FORKS}

{STACKS}
{GITHUB_URL}

- Do NOT use the word \"stars\" or \"forks\" in the counters.
- Keep total length under 260 characters.
- Output ONLY the tweet text, no JSON, no quotes.`;
};

const generateTweetText = async (tool: {
  name: string;
  tagline: string | null;
  description: string | null;
  stars: number;
  forks: number;
  websiteUrl: string | null;
  repositoryUrl: string;
  stacks: { name: string }[];
}, model: string, templateLabel: string) => {
  const prompt = buildPrompt(tool, templateLabel);

  const { data, error } = await tryCatch(
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-domain.com",
        "X-Title": "Tweet Generator",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 220,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`OpenRouter error [${res.status}]: ${errorText}`);
      }
      return res.json();
    }),
  );

  if (error || !data) return null;

  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  return String(content).trim();
};

export const generateTweetSuggestions = adminProcedure
  .createServerAction()
  .input(generateTweetSchema)
  .handler(async ({ input }) => {
    const candidates = await findTweetCandidates({ take: input.count });

    if (!candidates.length) {
      return { suggestions: [] };
    }

    const suggestions: {
      id: string;
      slug: string;
      name: string;
      stars: number;
      forks: number;
      stacks: { name: string; slug: string }[];
      imageUrl: string | null;
      text: string;
    }[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const tool = candidates[i];
      const templateLabel = TWEET_TEMPLATES[i % TWEET_TEMPLATES.length];
      const aiText = await generateTweetText(tool, input.model, templateLabel);
      const text = aiText || buildTweetText(tool);

      suggestions.push({
        id: tool.id,
        slug: tool.slug,
        name: tool.name,
        stars: tool.stars,
        forks: tool.forks,
        stacks: tool.stacks,
        imageUrl: pickImageUrl(tool),
        text,
      });

      await new Promise((r) => setTimeout(r, 1000));
    }

    if (suggestions.length) {
      await db.tool.updateMany({
        where: { id: { in: suggestions.map((tool) => tool.id) } },
        data: { isTweeted: true },
      });
    }

    return { suggestions };
  });

export const updateTweetImage = adminProcedure
  .createServerAction()
  .input(updateTweetImageSchema)
  .handler(async ({ input }) => {
    const tool = await db.tool.findUnique({
      where: { id: input.toolId },
      select: {
        id: true,
        screenshots: { select: { id: true, order: true }, orderBy: { order: "asc" } },
      },
    });

    if (!tool) throw new Error("Tool not found");

    const primary = tool.screenshots.find((s) => s.order === 0) ?? tool.screenshots[0];

    if (primary) {
      await db.toolScreenshot.update({
        where: { id: primary.id },
        data: { imageUrl: input.imageUrl, order: 0 },
      });
    } else {
      await db.toolScreenshot.create({
        data: {
          toolId: tool.id,
          imageUrl: input.imageUrl,
          caption: "Tweet image",
          order: 0,
        },
      });
    }

    await db.tool.update({
      where: { id: tool.id },
      data: { screenshotUrl: input.imageUrl },
    });

    return { url: input.imageUrl };
  });

export const resetTweetedTools = adminProcedure
  .createServerAction()
  .input(resetTweetedSchema)
  .handler(async ({ input }) => {
    const result = await db.tool.updateMany({
      where: { id: { in: input.ids } },
      data: { isTweeted: false },
    });

    return { updated: result.count };
  });
