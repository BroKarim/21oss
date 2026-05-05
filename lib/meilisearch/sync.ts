import "server-only";

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
