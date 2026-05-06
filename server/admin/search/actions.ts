"use server";

import { z } from "zod";
import { ToolType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { adminProcedure } from "@/lib/safe-actions";
import { ensureTemplateSearchMetadata } from "@/lib/ai/search-indexing";
import { applyTemplatesIndexSettings, ensureTemplatesIndex } from "@/lib/meilisearch/indexes";
import { fullReindexTemplates, syncTemplateDocument } from "@/lib/meilisearch/sync";
import { db } from "@/services/db";

const searchInitSchema = z.object({}).default({});
const syncTemplateSchema = z.object({
  toolId: z.string().min(1),
  force: z.boolean().optional().default(false),
});
const reindexTemplatesSchema = z.object({
  take: z.number().int().min(1).max(500).optional().default(50),
  force: z.boolean().optional().default(false),
});
const backfillSearchMetadataSchema = z.object({
  take: z.number().int().min(1).max(1000).optional().default(100),
});

export const initializeMeiliIndex = adminProcedure
  .createServerAction()
  .input(searchInitSchema)
  .handler(async () => {
    await ensureTemplatesIndex();
    const task = await applyTemplatesIndexSettings();

    return {
      taskUid: task.taskUid,
    };
  });

export const syncTemplateToSearch = adminProcedure
  .createServerAction()
  .input(syncTemplateSchema)
  .handler(async ({ input }) => {
    const result = await syncTemplateDocument(input.toolId, {
      force: input.force,
    });

    revalidateTag("tools");

    return result;
  });

export const reindexTemplatesToSearch = adminProcedure
  .createServerAction()
  .input(reindexTemplatesSchema)
  .handler(async ({ input }) => {
    const result = await fullReindexTemplates({
      take: input.take,
      force: input.force,
    });

    revalidateTag("tools");

    return result;
  });

export const backfillTemplateSearchMetadata = adminProcedure
  .createServerAction()
  .input(backfillSearchMetadataSchema)
  .handler(async ({ input }) => {
    const templates = await db.tool.findMany({
      where: {
        type: ToolType.Template,
        searchMetadata: {
          is: null,
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: input.take,
    });

    let refreshed = 0;

    for (const template of templates) {
      await ensureTemplateSearchMetadata(template.id, { force: false });
      refreshed += 1;
    }

    revalidateTag("tools");

    return {
      total: templates.length,
      refreshed,
    };
  });
