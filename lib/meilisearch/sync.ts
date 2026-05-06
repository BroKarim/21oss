import { ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { buildPublishedTemplateSearchDocuments, buildTemplateSearchDocument } from "@/lib/ai/search-indexing";
import { getTemplatesIndex } from "@/lib/meilisearch/indexes";
import type { TemplateSearchDocument } from "@/lib/meilisearch/types";

export async function upsertTemplateDocuments(documents: TemplateSearchDocument[]) {
  if (documents.length === 0) return null;

  return getTemplatesIndex().addDocuments(documents);
}

export async function deleteTemplateDocument(documentId: string) {
  return getTemplatesIndex().deleteDocument(documentId);
}

export async function reindexTemplateDocuments(documents: TemplateSearchDocument[]) {
  const index = getTemplatesIndex();

  await index.deleteAllDocuments();
  if (documents.length === 0) return null;

  return index.addDocuments(documents);
}

export async function syncTemplateDocument(toolId: string, options?: { force?: boolean }) {
  const tool = await db.tool.findUnique({
    where: { id: toolId },
    select: {
      id: true,
      type: true,
      status: true,
    },
  });

  if (!tool) {
    throw new Error("Tool not found");
  }

  if (tool.type !== ToolType.Template || tool.status !== ToolStatus.Published) {
    await deleteTemplateDocument(tool.id);
    return { deleted: true };
  }

  const result = await buildTemplateSearchDocument(tool.id, options);
  await upsertTemplateDocuments([result.document]);

  return {
    deleted: false,
    refreshed: result.refreshed,
    documentId: result.document.id,
  };
}

export async function fullReindexTemplates(options?: { take?: number; force?: boolean }) {
  const result = await buildPublishedTemplateSearchDocuments(options);
  await reindexTemplateDocuments(result.documents);

  return result;
}
