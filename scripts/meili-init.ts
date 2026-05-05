import "dotenv/config";

import { applyTemplatesIndexSettings, ensureTemplatesIndex, templatesIndexUid } from "@/lib/meilisearch/indexes";

async function main() {
  await ensureTemplatesIndex();
  const task = await applyTemplatesIndexSettings();

  console.log(`[meili-init] index ready: ${templatesIndexUid}`);
  console.log(`[meili-init] settings task uid: ${task.taskUid}`);
}

main().catch((error) => {
  console.error("[meili-init] failed", error);
  process.exit(1);
});
