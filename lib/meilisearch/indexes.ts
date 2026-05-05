import "server-only";

import { env } from "@/env";
import { meiliClient } from "@/lib/meilisearch/client";
import type { TemplateSearchDocument } from "@/lib/meilisearch/types";

export const templatesIndexUid = env.MEILI_INDEX_TEMPLATES;

export function getTemplatesIndex() {
  return meiliClient.index<TemplateSearchDocument>(templatesIndexUid);
}
