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

// ✅ Tambah/Edit Tool (tanpa alternatives)
export const upsertTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { id, categories, ...input } }) => {
    const categoryIds = categories?.map((id) => ({ id }));

    const tool = id
      ? await db.tool.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            categories: { set: categoryIds },
          },
        })
      : await db.tool.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            categories: { connect: categoryIds },
          },
        });

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
