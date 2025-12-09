"use server";

import { slugify } from "@primoui/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { freeStuffSchema } from "./schema";
import { env } from "@/env";

/* ============================================================
   UPSERT: create / update DevPerk
   ============================================================ */
export const upsertFreeStuff = adminProcedure
  .createServerAction()
  .input(freeStuffSchema)
  .handler(async ({ input }) => {
    const { id, tags, ...rest } = input;

    const slug = rest.slug || slugify(rest.name);

    const tagStrings = tags?.map((t) => t.value) ?? [];

    const item = id
      ? await db.devPerk.update({
          where: { id },
          data: { ...rest, slug, tags: tagStrings },
        })
      : await db.devPerk.create({
          data: { ...rest, slug, tags: tagStrings },
        });

    revalidateTag("free-stuff");
    revalidateTag(`free-stuff-${item.slug}`);

    return item;
  });

/* ============================================================
   DELETE
   ============================================================ */
export const deleteFreeStuff = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const items = await db.devPerk.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    });

    if (items.length === 0) throw new Error("No items found to delete");

    const result = await db.devPerk.deleteMany({
      where: { id: { in: ids } },
    });

    // revalidate
    revalidatePath("/admin/free-stuff");
    revalidateTag("free-stuff");

    return result;
  });

// Schema validasi input untuk Auto Fill

const autoFillPerkSchema = z.object({
  url: z.string().url("Invalid URL"),

  model: z.string().min(1, "Model is required"),
});

const generateFaviconSchema = z.object({
  url: z.string().url(),
  path: z.string().optional(),
});
export const generateFavicon = adminProcedure
  .createServerAction()
  .input(generateFaviconSchema)
  .handler(async ({ input }) => {
    const { url } = input;

    try {
      const domain = new URL(url).hostname;

      const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${domain}`;

      return faviconUrl;
    } catch {
      throw new Error("Invalid URL format");
    }
  });
/* ============================================================

   AUTO FILL: Generate Perk Details via AI

   ============================================================ */

export const autoFillPerk = adminProcedure

  .createServerAction()

  .input(autoFillPerkSchema)

  .handler(async ({ input }) => {
    const { url, model } = input;

    console.log("🔍 Starting auto-fill for Perk:", url);

    const prompt = `

    Role: You are a Student Developer Advocate. Your job is to analyze a "Student Benefit" or "Dev Tool" URL and extract key information.
    Target URL: ${url}
    Task:
    1. Identify the tool/service name.
    2. Write a punchy, short description (max 20 words) focusing EXCLUSIVELY on the student program's specific offering and direct benefit (e.g., "Free one-year access to all IDEs" or "Lifetime 50% discount on Pro Plan").
    3. ESTIMATE the MONTHLY monetary value in USD for the pro/standard version.
       - STRICT FORMAT: "$XX" or "$XX-$YY" (e.g., "$20", "$49", or "$10-$15").
       - Do NOT include words like "/month", "approx", or "USD". Just the symbol and number.
       - If it implies a yearly cost, divide by 12 to get the monthly equivalent.
    4. Detect relevant tags.
    5. Determine if it is totally free (isFree).

    Respond ONLY with valid JSON:
    {
      "name": "Tool Name",
      "description": "Short description...",
      "value": "$20", 
      "tags": ["tag1", "tag2"],
      "isFree": false
    }

    `;

    try {
      // Sama persis dengan logic fetch OpenRouter Anda sebelumnya

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-domain.com", // Ganti dengan domain asli jika ada
          "X-Title": "AutoFill Perk",
        },

        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      if (!res.ok) throw new Error(`API request failed: ${res.status}`);

      const data = await res.json();

      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error("AI returned empty response");

      const jsonStr = content
        .trim()
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "");

      const jsonStart = jsonStr.indexOf("{");

      const jsonEnd = jsonStr.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === 0) throw new Error("No JSON object found");

      const parsed = JSON.parse(jsonStr.slice(jsonStart, jsonEnd));
      let autoLogoUrl = "";
      try {
        const domain = new URL(url).hostname;
        autoLogoUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${domain}`;
      } catch {}
      return {
        name: parsed.name || "",
        description: parsed.description || "",
        value: parsed.value || "",
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        isFree: typeof parsed.isFree === "boolean" ? parsed.isFree : false,
        logoUrl: autoLogoUrl,
      };
    } catch (error) {
      console.error("AutoFill Error:", error);

      throw new Error("Failed to auto-fill perk details");
    }
  });
