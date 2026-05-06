import "dotenv/config";

import { fullReindexTemplates } from "@/lib/meilisearch/sync";

async function main() {
  const take = Number(process.env.TAKE ?? 50);
  const force = process.env.FORCE === "1";

  const result = await fullReindexTemplates({ take, force });
  console.log(`[meili-reindex] total=${result.total} refreshed=${result.refreshed} indexed=${result.documents.length}`);
}

main().catch((error) => {
  console.error("[meili-reindex] failed", error);
  process.exit(1);
});
