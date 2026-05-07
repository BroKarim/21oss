import { env } from "@/env";
import { getMeiliClient } from "@/lib/meilisearch/client";
import { templateIndexSettings } from "@/lib/meilisearch/settings";
import type { TemplateSearchDocument } from "@/lib/meilisearch/types";

export const templatesIndexUid = env.MEILI_INDEX_TEMPLATES;

export function getTemplatesIndex() {
  return getMeiliClient().index<TemplateSearchDocument>(templatesIndexUid);
}

export async function ensureTemplatesIndex() {
  const meiliClient = getMeiliClient();

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
