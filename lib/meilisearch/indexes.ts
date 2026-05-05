import "server-only";

import { env } from "@/env";
import { meiliClient } from "@/lib/meilisearch/client";
import { templateIndexSettings } from "@/lib/meilisearch/settings";
import type { TemplateSearchDocument } from "@/lib/meilisearch/types";

export const templatesIndexUid = env.MEILI_INDEX_TEMPLATES;

export function getTemplatesIndex() {
  return meiliClient.index<TemplateSearchDocument>(templatesIndexUid);
}

export async function ensureTemplatesIndex() {
  try {
    await meiliClient.getRawIndex(templatesIndexUid);
  } catch {
    await meiliClient.createIndex(templatesIndexUid, {
      primaryKey: "id",
    });
  }

  return getTemplatesIndex();
}

export async function applyTemplatesIndexSettings() {
  const index = await ensureTemplatesIndex();
  return index.updateSettings(templateIndexSettings);
}
