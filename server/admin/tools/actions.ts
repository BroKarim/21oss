"use server";

import { slugify, getRandomString } from "@primoui/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { ToolStatus, ToolType } from "@prisma/client";
import { removeS3Directories, uploadToS3Storage, optimizeImage } from "@/lib/media";
import { getToolRepositoryData } from "@/lib/repositories";
import { adminProcedure } from "@/lib/safe-actions";
import { toolSchema } from "@/server/admin/tools/schema";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";
import { env } from "@/env";

interface AutoFillResponse {
  name: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  stacks: string[];
}
const autoFillSchema = z.object({
  repositoryUrl: z.string().url("Please provide a valid URL."),
  model: z.string().min(1, "Model is required"),
});

const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VALID_VIDEO_TYPES = ["video/mp4"];

export const upsertTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input }) => {
    console.log("✅ upsertTool called", input);
    const { id, categories, platforms, stacks, ...rest } = input;
    const toolType: ToolType = rest.type ?? ToolType.Tool;
    const slug = rest.slug || slugify(rest.name);

    const categoryIds = categories?.map((id) => ({ id }));
    const platformIds = platforms?.map((id) => ({ id }));
    const stackIds = stacks
      ? await Promise.all(
          stacks.map(async (stack) => {
            if (stack.id) {
              return { id: stack.id };
            }

            const stackSlug = slugify(stack.name);
            const existingStack = await db.stack.findUnique({
              where: { slug: stackSlug },
            });

            if (existingStack) {
              return { id: existingStack.id };
            }

            const newStack = await db.stack.create({
              data: {
                name: stack.name,
                slug: stackSlug,
              },
            });

            return { id: newStack.id };
          })
        )
      : [];

    console.info(`[UPSERTOOL] isUpdate: ${!!id}`);
    console.info(`[UPSERTOOL] input:`, input);

    const tool = id
      ? await db.tool.update({
          where: { id },
          data: {
            ...rest,
            slug,
            type: toolType,
            categories: { set: categoryIds },
            platforms: { set: platformIds },
            stacks: { set: stackIds },
            screenshots: {
              deleteMany: {},
              create:
                rest.screenshots?.map((img, index) => ({
                  imageUrl: img.imageUrl,
                  caption: img.caption,
                  order: index,
                })) ?? [],
            },
          },
        })
      : await db.tool.create({
          data: {
            ...rest,
            slug,
            type: toolType,
            categories: { connect: categoryIds },
            platforms: { connect: platformIds },
            stacks: { connect: stackIds },
            screenshots: {
              create:
                rest.screenshots?.map((img, index) => ({
                  imageUrl: img.imageUrl,
                  caption: img.caption,
                  order: index,
                })) ?? [],
            },
          },
        });

    // Create flow nodes (simple approach)

    console.info(`[UPSERTOOL] done, id=${tool.id}, status=${tool.status}`);

    revalidateTag("tools");
    revalidateTag(`tool-${tool.slug}`);

    return tool;
  });

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    console.log("🗑️ Delete tools called with ids:", ids);

    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true, id: true },
    });

    console.log("🔍 Found tools:", tools);

    if (tools.length === 0) {
      throw new Error("No tools found to delete");
    }

    const result = await db.$transaction(async (tx) => {
      console.log("🔄 Starting transaction to delete tools...");

      console.log("🗑️ Deleting screenshots...");
      await tx.toolScreenshot.deleteMany({
        where: { toolId: { in: ids } },
      });

      console.log("🗑️ Deleting likes...");
      await tx.like.deleteMany({
        where: { toolId: { in: ids } },
      });

      console.log("🗑️ Deleting reports...");
      await tx.report.deleteMany({
        where: { toolId: { in: ids } },
      });

      console.log("🗑️ Disconnecting many-to-many relations...");
      for (const toolId of ids) {
        await tx.tool.update({
          where: { id: toolId },
          data: {
            categories: { set: [] },
            platforms: { set: [] },
            stacks: { set: [] },
          },
        });
      }

      console.log("🗑️ Deleting tools...");
      const deleteResult = await tx.tool.deleteMany({
        where: { id: { in: ids } },
      });

      console.log("✅ Delete result:", deleteResult);
      return deleteResult;
    });

    // Revalidate cache
    revalidatePath("/admin/tools");
    revalidateTag("tools");

    // Hapus S3 directories
    after(async () => {
      console.log("🗑️ Cleaning up S3 directories...");
      await removeS3Directories(tools.map((tool) => `tools/${tool.slug}`));
    });

    console.log("🎉 Tools deletion completed successfully");
    return result;
  });

const validateFileNotEmpty = (file: File): boolean => {
  return file.size > 0;
};

const validateFileType = (file: File): boolean => {
  const isImage = VALID_IMAGE_TYPES.includes(file.type);
  const isVideo = VALID_VIDEO_TYPES.includes(file.type);
  return isImage || isVideo;
};

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;

const validateFileSize = (file: File): boolean => {
  if (VALID_IMAGE_TYPES.includes(file.type)) {
    return file.size <= MAX_IMAGE_SIZE;
  }
  if (VALID_VIDEO_TYPES.includes(file.type)) {
    return file.size <= MAX_VIDEO_SIZE;
  }
  return false;
};

export const uploadToolMedia = adminProcedure
  .createServerAction()
  .input(
    z.object({
      toolName: z.string(),
      file: z.instanceof(File).refine(validateFileNotEmpty, "File tidak boleh kosong").refine(validateFileType, "Hanya mendukung file JPG, PNG, atau MP4").refine(validateFileSize, "Ukuran file melebihi batas"),
    })
  )
  .handler(async ({ input: { toolName, file } }) => {
    const isVideo = VALID_VIDEO_TYPES.includes(file.type);

    const buffer = Buffer.from(await file.arrayBuffer());

    const finalBuffer = isVideo ? buffer : await optimizeImage(buffer);
    const extension = isVideo ? "mp4" : "webp";
    const randomKey = getRandomString();
    const key = `${slugify(toolName)}/${randomKey}.${extension}`;

    const fileUrl = await uploadToS3Storage(finalBuffer, key);

    return {
      url: fileUrl,
      type: isVideo ? "video" : "image",
    };
  });

export const autoFillFromRepo = adminProcedure
  .createServerAction()
  .input(autoFillSchema)
  .handler(async ({ input }) => {
    const { repositoryUrl, model } = input;
    console.log("🔍 Starting auto-fill for:", repositoryUrl);
    // Extract repo info from URL
    const repoMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!repoMatch) {
      throw new Error("Invalid GitHub URL format");
    }

    const [, owner, repo] = repoMatch;
    const cleanRepo = repo.replace(/\.git$/, ""); // remove .git suffix

    const prompt = `
    You are a senior technical writer and developer advocate. Analyze this GitHub repository: ${owner}/${cleanRepo}

    Based on the repository name, owner, and what you can infer, provide:
    - name: The project/tool name (clean, without prefixes like "awesome-" or suffixes like "-js")
    - tagline: One short marketing sentence (max 8 words)
    - description: Brief explanation of what it does (max 40 words)
    - websiteUrl: Official website or documentation link (if none, return an empty string)
    - stacks: Main technologies/frameworks used (be specific, e.g., "react", "typeScript", "aws-s3", "postgresql") lowercase only

    Formatting rules for "stacks":
    - All items must be lowercase
    - Do not include duplicates or unrelated terms

    Respond ONLY with valid JSON:
    {
      "name": "Project Name",
      "tagline": "Short description",
      "description": "A comprehensive 2-3 paragraph description that thoroughly explains what this tool does, its standout features, key benefits, typical use cases, and target audience",
      "stacks": ["technology1", "technology2", "technology3"]
    }`;

    try {
      console.log("🤖 Calling OpenRouter API...");

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-domain.com",
          "X-Title": "AutoFill Tool",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ OpenRouter API Error:", res.status, errorText);
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("📝 Raw API Response:", JSON.stringify(data, null, 2));

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error("❌ Empty response from AI:", data);
        throw new Error("AI returned empty response");
      }

      console.log("🎯 AI Content:", content);

      let parsed: AutoFillResponse;
      try {
        // Improved JSON extraction
        let jsonStr = content.trim();

        // Remove markdown code blocks
        jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "");

        // Find JSON object boundaries
        const jsonStart = jsonStr.indexOf("{");
        const jsonEnd = jsonStr.lastIndexOf("}") + 1;

        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No JSON object found in response");
        }

        jsonStr = jsonStr.slice(jsonStart, jsonEnd);
        console.log("🔧 Cleaned JSON:", jsonStr);

        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("❌ Content was:", content);
        throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
      }

      // Validate and clean response
      // If AI doesn't return a websiteUrl, fall back to the repo URL so the tool can always be published.
      const aiWebsiteUrl = typeof parsed.websiteUrl === "string" ? parsed.websiteUrl.trim() : "";
      const result: AutoFillResponse = {
        name: typeof parsed.name === "string" ? parsed.name.trim() : "Untitled Project",
        tagline: typeof parsed.tagline === "string" ? parsed.tagline.trim() : "A great tool",
        websiteUrl: aiWebsiteUrl || repositoryUrl,
        description: typeof parsed.description === "string" ? parsed.description.trim() : "This is a useful tool.",
        stacks: Array.isArray(parsed.stacks)
          ? parsed.stacks
              .filter(Boolean)
              .map((s) => String(s).trim())
              .filter(Boolean)
          : [],
      };

      console.log("✅ Final result:", result);
      return result;
    } catch (error) {
      console.error("❌ AutoFill complete error:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Failed to auto-fill from repository");
    }
  });

export const fetchToolRepositoryData = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } });
    const result = await tryCatch(getToolRepositoryData(tool.repositoryUrl));

    if (result.error || !result.data) {
      console.error(`Failed to fetch repository data for ${tool.name}`, {
        error: result.error,
        slug: tool.slug,
      });
      return null;
    }

    await db.tool.update({
      where: { id: tool.id },
      data: result.data,
    });

    revalidateTag("tools");
    revalidateTag(`tool-${tool.slug}`);
  });

export const fetchAllToolRepositoryData = adminProcedure
  .createServerAction()
  .input(z.object({ limit: z.number().optional() }).optional()) // bisa kasih limit per-run
  .handler(async ({ input }) => {
    const startTime = Date.now();
    const limit = input?.limit;

    console.log("🚀 Starting fetchAllToolRepositoryData...");
    console.log(`📊 Limit: ${limit || "No limit (fetch all)"}`);

    const tools = await db.tool.findMany({
      take: limit ?? undefined,
    });

    console.log(`📋 Found ${tools.length} tools to process`);
    console.log(`⏱️  Estimated time: ~${tools.length * 1.5} seconds`);
    console.log("─".repeat(50));

    let successCount = 0;
    let errorCount = 0;
    let processedCount = 0;

    for (const tool of tools) {
      processedCount++;
      const toolStartTime = Date.now();

      console.log(`[${processedCount}/${tools.length}] Processing: ${tool.name}`);
      console.log(`  📁 Repository: ${tool.repositoryUrl}`);
      console.log(`  🏷️  Slug: ${tool.slug}`);

      const result = await tryCatch(getToolRepositoryData(tool.repositoryUrl));

      const toolEndTime = Date.now();
      const toolDuration = toolEndTime - toolStartTime;

      if (result.error || !result.data) {
        errorCount++;
        console.error(`  ❌ FAILED (${toolDuration}ms)`, {
          error: result.error,
          slug: tool.slug,
        });
        console.log(`  💡 Skipping to next tool...`);
        continue;
      }

      await db.tool.update({
        where: { id: tool.id },
        data: result.data,
      });

      successCount++;
      console.log(`  ✅ SUCCESS (${toolDuration}ms)`);
      console.log(`  📈 Updated data: stars=${result.data.stars || "N/A"}, forks=${result.data.forks || "N/A"}`);

      revalidateTag("tools");
      revalidateTag(`tool-${tool.slug}`);

      // Progress summary every 10 items or on last item
      if (processedCount % 10 === 0 || processedCount === tools.length) {
        const currentTime = Date.now();
        const elapsedTime = Math.round((currentTime - startTime) / 1000);
        const progress = Math.round((processedCount / tools.length) * 100);

        console.log("📊 PROGRESS SUMMARY:");
        console.log(`  🎯 Progress: ${processedCount}/${tools.length} (${progress}%)`);
        console.log(`  ✅ Success: ${successCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log(`  ⏱️  Elapsed: ${elapsedTime}s`);
        console.log("─".repeat(50));
      }
    }

    const endTime = Date.now();
    const totalDuration = Math.round((endTime - startTime) / 1000);
    const avgTimePerTool = Math.round((totalDuration / tools.length) * 100) / 100;

    console.log("🎉 FINAL SUMMARY:");
    console.log(`  📊 Total Tools: ${tools.length}`);
    console.log(`  ✅ Successful Updates: ${successCount}`);
    console.log(`  ❌ Failed Updates: ${errorCount}`);
    console.log(`  📈 Success Rate: ${Math.round((successCount / tools.length) * 100)}%`);
    console.log(`  ⏱️  Total Duration: ${totalDuration}s`);
    console.log(`  📊 Average Time per Tool: ${avgTimePerTool}s`);
    console.log(`  🔄 Cache Revalidated: tools + ${successCount} individual tool tags`);
    console.log("🎯 fetchAllToolRepositoryData completed!");
    console.log("=".repeat(50));

    return {
      updated: successCount,
      errors: errorCount,
      total: tools.length,
      duration: totalDuration,
    };
  });

// ---------------------------------------------------------------------------
// Batch AI Auto-Fill + Auto-Publish — processes all Draft tools
// ---------------------------------------------------------------------------

interface BatchAutoFillResponse {
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  stacks: string[];
  platforms: string[];
}

const batchAutoFillSchema = z.object({
  model: z.string().default("anthropic/claude-sonnet-4.5"),
});

export const batchAutoFillDraftTools = adminProcedure
  .createServerAction()
  .input(batchAutoFillSchema)
  .handler(async ({ input }) => {
    const { model } = input;
    const startTime = Date.now();

    // 1. Fetch all Draft tools
    const tools = await db.tool.findMany({
      where: { status: "Draft" },
      select: {
        id: true,
        name: true,
        slug: true,
        repositoryUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (tools.length === 0) {
      return { processed: 0, success: 0, errors: 0 };
    }

    // 2. Fetch all platform options from DB (to inject into AI prompt)
    const allPlatforms = await db.platform.findMany({
      select: { id: true, name: true, slug: true },
    });
    const platformNames = allPlatforms.map((p) => p.name);

    console.log(`🤖 batchAutoFillDraftTools: ${tools.length} Draft tools`);
    console.log(`📋 Available platforms: ${platformNames.join(", ")}`);
    console.log(`🧠 Model: ${model}`);
    console.log("─".repeat(50));

    let success = 0;
    let errors = 0;

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];

      if (!tool.repositoryUrl) {
        console.warn(`  ⚠️  [${i + 1}/${tools.length}] Skip ${tool.name} — no repositoryUrl`);
        errors++;
        continue;
      }

      const repoMatch = tool.repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (!repoMatch) {
        console.warn(`  ⚠️  [${i + 1}/${tools.length}] Skip ${tool.name} — invalid GitHub URL`);
        errors++;
        continue;
      }

      const [, owner, repo] = repoMatch;
      const cleanRepo = repo.replace(/\.git$/, "");

      // Build prompt with platform options
      const prompt = `You are a senior technical writer. Analyze this GitHub repository: ${owner}/${cleanRepo}

Provide:
- name: Clean project name (no prefixes like "awesome-" or suffixes like "-js")
- tagline: One short marketing sentence (max 8 words)
- description: Clear explanation of what it does (max 80 words)
- websiteUrl: Official website/docs URL (empty string if none)
- stacks: Main technologies used (lowercase, e.g. "react", "typescript")
- platforms: Select ALL that apply from ONLY these options: ${JSON.stringify(platformNames)}. You MUST pick at least one. Match names exactly.

Respond ONLY with valid JSON:
{
  "name": "...",
  "tagline": "...",
  "description": "...",
  "websiteUrl": "",
  "stacks": ["tech1", "tech2"],
  "platforms": ["Website", "CLI"]
}`;

      // --- AI Request ---
      const { data: res, error: fetchError } = await tryCatch(
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-domain.com",
            "X-Title": "BatchAutoFill",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 400,
          }),
        }).then((r) => {
          if (!r.ok) throw new Error(`OpenRouter error [${r.status}]`);
          return r.json();
        }),
      );

      if (fetchError || !res) {
        console.error(`  ❌ [${i + 1}/${tools.length}] AI failed for ${tool.name}:`, { error: fetchError });
        errors++;
        // Longer delay after error (could be rate limit)
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }

      const content: string = res.choices?.[0]?.message?.content ?? "";
      if (!content) {
        errors++;
        continue;
      }

      // --- Parse JSON ---
      let parsed: BatchAutoFillResponse | null = null;
      try {
        let jsonStr = content.trim().replace(/```json\s*/g, "").replace(/```\s*/g, "");
        const s = jsonStr.indexOf("{");
        const e = jsonStr.lastIndexOf("}") + 1;
        if (s !== -1 && e > 0) parsed = JSON.parse(jsonStr.slice(s, e));
      } catch {
        console.error(`  ❌ [${i + 1}/${tools.length}] JSON parse failed for ${tool.name}`);
        errors++;
        continue;
      }

      if (!parsed) {
        errors++;
        continue;
      }

      // --- Resolve stacks ---
      const stackNames: string[] = Array.isArray(parsed.stacks)
        ? parsed.stacks.filter(Boolean).map((s) => String(s).trim().toLowerCase()).filter(Boolean)
        : [];

      const stackIds = await Promise.all(
        stackNames.map(async (name) => {
          const stackSlug = slugify(name);
          const existing = await db.stack.findUnique({ where: { slug: stackSlug } });
          if (existing) return { id: existing.id };
          const created = await db.stack.create({ data: { name, slug: stackSlug } });
          return { id: created.id };
        }),
      );

      // --- Resolve platforms (match AI response to DB records) ---
      const aiPlatformNames: string[] = Array.isArray(parsed.platforms)
        ? parsed.platforms.filter(Boolean).map((p) => String(p).trim())
        : [];

      const platformIds = aiPlatformNames
        .map((name) => {
          const match = allPlatforms.find(
            (p) => p.name.toLowerCase() === name.toLowerCase(),
          );
          return match ? { id: match.id } : null;
        })
        .filter(Boolean) as { id: string }[];

      // --- Update DB: fill data + publish ---
      const aiWebsiteUrl = typeof parsed.websiteUrl === "string" ? parsed.websiteUrl.trim() : "";

      const { error: updateError } = await tryCatch(
        db.tool.update({
          where: { id: tool.id },
          data: {
            name: parsed.name || tool.name,
            tagline: parsed.tagline || null,
            description: parsed.description || null,
            websiteUrl: aiWebsiteUrl || tool.repositoryUrl,
            stacks: { set: stackIds },
            platforms: { set: platformIds },
            status: ToolStatus.Published,
            publishedAt: new Date(),
          },
        }),
      );

      if (updateError) {
        console.error(`  ❌ [${i + 1}/${tools.length}] DB failed for ${tool.name}:`, { error: updateError });
        errors++;
        continue;
      }

      success++;
      console.log(`  ✅ [${i + 1}/${tools.length}] ${tool.name} → Published (${stackNames.length} stacks, ${platformIds.length} platforms)`);

      // Progress summary every 10 items
      if ((i + 1) % 10 === 0) {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const avgPerItem = Math.round(elapsed / (i + 1));
        const remaining = (tools.length - i - 1) * avgPerItem;
        console.log(`  📊 Progress: ${i + 1}/${tools.length} | ✅ ${success} | ❌ ${errors} | ⏱️ ${elapsed}s elapsed | ~${remaining}s remaining`);
      }

      // 2s delay between requests to respect rate limits
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Revalidate once at the end (not per-item)
    revalidateTag("tools");

    const totalDuration = Math.round((Date.now() - startTime) / 1000);
    console.log("─".repeat(50));
    console.log(`🎉 Batch AI fill done in ${totalDuration}s — success: ${success}, errors: ${errors}, total: ${tools.length}`);

    return { processed: tools.length, success, errors };
  });
