"use server";

import { slugify } from "@primoui/utils";
import { ToolStatus } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { removeS3Directories } from "@/lib/media";
import { getToolRepositoryData } from "@/lib/repositories";
import { adminProcedure } from "@/lib/safe-actions";
import { toolSchema } from "@/server/admin/tools/schema";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

console.log("✅ upsertTool loaded");
// ✅ Tambah/Edit Tool (tanpa alternatives)
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
    const stackIds = stacks?.map((id) => ({ id }));

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
          },
        })
      : await db.tool.create({
          data: {
            ...rest,
            slug,
            categories: { connect: categoryIds },
            platforms: { connect: platformIds },
            stacks: { connect: stackIds },
          },
        });

    console.info(`[UPSERTOOL] done, id=${tool.id}, status=${tool.status}`);

    revalidateTag("tools");
    revalidateTag(`tool-${tool.slug}`);

    if (tool.status === ToolStatus.Scheduled) {
      revalidateTag("schedule");
    }

    return tool;
  });

// ✅ Hapus Tool
export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    });

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/tools");
    revalidateTag("tools");

    after(async () => {
      await removeS3Directories(tools.map((tool) => `tools/${tool.slug}`));
    });

    return true;
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
