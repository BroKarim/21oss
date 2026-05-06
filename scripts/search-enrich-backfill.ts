import "dotenv/config";

import { ToolType } from "@prisma/client";
import { ensureTemplateSearchMetadata } from "@/lib/ai/search-indexing";
import { db } from "@/services/db";

async function main() {
  const take = Number(process.env.TAKE ?? 50);
  const force = process.env.FORCE === "1";

  const templates = await db.tool.findMany({
    where: {
      type: ToolType.Template,
    },
    select: {
      id: true,
      slug: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take,
  });

  let refreshed = 0;

  for (const template of templates) {
    const result = await ensureTemplateSearchMetadata(template.id, { force });
    if (result.refreshed) refreshed += 1;
    console.log(`[search-enrich] ${template.slug} refreshed=${result.refreshed}`);
  }

  console.log(`[search-enrich] total=${templates.length} refreshed=${refreshed}`);
}

main()
  .catch((error) => {
    console.error("[search-enrich] failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
