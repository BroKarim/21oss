"use server";

import { slugify } from "@primoui/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { removeS3Directories } from "@/lib/media";
import { getToolRepositoryData } from "@/lib/repositories";
import { adminProcedure } from "@/lib/safe-actions";
import { toolSchema } from "@/server/admin/tools/schema";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

export const upsertTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input }) => {
    console.log("✅ upsertTool called", input);
    const { id, categories, platforms, stacks, ...rest } = input;

    const slug = rest.slug || slugify(rest.name);

    // Format relasi untuk Prisma
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

// ✅ Hapus Tool
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

    // Gunakan transaction untuk memastikan semua operasi berhasil atau rollback
    const result = await db.$transaction(async (tx) => {
      console.log("🔄 Starting transaction to delete tools...");

      // 1. Hapus screenshots terlebih dahulu
      console.log("🗑️ Deleting screenshots...");
      await tx.toolScreenshot.deleteMany({
        where: { toolId: { in: ids } },
      });

      // 2. Hapus likes
      console.log("🗑️ Deleting likes...");
      await tx.like.deleteMany({
        where: { toolId: { in: ids } },
      });

      // 3. Hapus reports
      console.log("🗑️ Deleting reports...");
      await tx.report.deleteMany({
        where: { toolId: { in: ids } },
      });

      // 4. Putuskan hubungan many-to-many (categories, platforms, stacks)
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

      // 5. Akhirnya, hapus tools
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

// ✅ Ambil data dari repository tool
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
