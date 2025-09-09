"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { getAwesomeRepositoryData } from "@/lib/repositories";
import { tryCatch } from "@/utils/helpers";
import { db } from "@/services/db";
import { awesomeSchema } from "./schema";

// 🔹 Create / Update AwesomeList
export const upsertAwesome = adminProcedure
  .createServerAction()
  .input(awesomeSchema)
  .handler(async ({ input }) => {
    console.log("✅ upsertAwesome called", input);
    const { id, ...rest } = input;

    const awesome = id
      ? await db.awesomeList.update({
          where: { id },
          data: rest,
        })
      : await db.awesomeList.create({
          data: rest,
        });

    console.info(`[UPSERTAWESOME] done, id=${awesome.id}`);

    revalidateTag("awesome");
    revalidateTag(`awesome-${awesome.id}`);

    return awesome;
  });

// 🔹 Delete AwesomeList (bisa multiple)
export const deleteAwesome = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.awesomeList.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/awesome");
    revalidateTag("awesome");

    // kalau nanti ada file (misal icon/logo), bisa pakai after() seperti di ads
    after(async () => {
      console.log(`[DELETEAWESOME] done, ids=${ids.join(",")}`);
    });

    return true;
  });

export const fetchAllAwesomeRepositoryData = adminProcedure
  .createServerAction()
  .input(z.object({ limit: z.number().optional() }).optional())
  .handler(async ({ input }) => {
    const startTime = Date.now();
    const limit = input?.limit;

    console.log("🚀 Starting fetchAllAwesomeRepositoryData...");
    console.log(`📊 Limit: ${limit || "No limit (fetch all)"}`);

    const lists = await db.awesomeList.findMany({
      take: limit ?? undefined,
    });

    console.log(`📋 Found ${lists.length} awesome lists to process`);
    console.log(`⏱️  Estimated time: ~${lists.length * 1.5} seconds`);
    console.log("─".repeat(50));

    let successCount = 0;
    let errorCount = 0;
    let processedCount = 0;

    for (const list of lists) {
      processedCount++;
      const listStartTime = Date.now();

      console.log(`[${processedCount}/${lists.length}] Processing: ${list.name}`);
      console.log(`  📁 Repository: ${list.repositoryUrl}`);

      const result = await tryCatch(getAwesomeRepositoryData(list.repositoryUrl));

      const listEndTime = Date.now();
      const listDuration = listEndTime - listStartTime;

      if (result.error || !result.data) {
        errorCount++;
        console.error(`  ❌ FAILED (${listDuration}ms)`, {
          error: result.error,
          id: list.id,
        });
        console.log(`  💡 Skipping to next awesome list...`);
        continue;
      }

      await db.awesomeList.update({
        where: { id: list.id },
        data: result.data,
      });

      successCount++;
      console.log(`  ✅ SUCCESS (${listDuration}ms)`);
      console.log(`  📈 Updated data: stars=${result.data.stars || "N/A"}, forks=${result.data.forks || "N/A"}`);

      revalidateTag("awesome-lists");
      revalidateTag(`awesome-${list.id}`);

      // Progress summary
      if (processedCount % 10 === 0 || processedCount === lists.length) {
        const currentTime = Date.now();
        const elapsedTime = Math.round((currentTime - startTime) / 1000);
        const progress = Math.round((processedCount / lists.length) * 100);

        console.log("📊 PROGRESS SUMMARY:");
        console.log(`  🎯 Progress: ${processedCount}/${lists.length} (${progress}%)`);
        console.log(`  ✅ Success: ${successCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log(`  ⏱️  Elapsed: ${elapsedTime}s`);
        console.log("─".repeat(50));
      }
    }

    const endTime = Date.now();
    const totalDuration = Math.round((endTime - startTime) / 1000);
    const avgTimePerList = Math.round((totalDuration / lists.length) * 100) / 100;

    console.log("🎉 FINAL SUMMARY:");
    console.log(`  📊 Total Awesome Lists: ${lists.length}`);
    console.log(`  ✅ Successful Updates: ${successCount}`);
    console.log(`  ❌ Failed Updates: ${errorCount}`);
    console.log(`  📈 Success Rate: ${Math.round((successCount / lists.length) * 100)}%`);
    console.log(`  ⏱️  Total Duration: ${totalDuration}s`);
    console.log(`  📊 Average Time per List: ${avgTimePerList}s`);
    console.log(`  🔄 Cache Revalidated: awesome-lists + ${successCount} individual awesome list tags`);
    console.log("🎯 fetchAllAwesomeRepositoryData completed!");
    console.log("=".repeat(50));

    return {
      updated: successCount,
      errors: errorCount,
      total: lists.length,
      duration: totalDuration,
    };
  });
