import "dotenv/config";

import { ToolType } from "@prisma/client";
import { db } from "@/services/db";

const TAKE = Number(process.env.TAKE ?? 500);
const BATCH = Number(process.env.BATCH ?? 100);
const LOG_EVERY = Number(process.env.LOG_EVERY ?? 200);

async function main() {
  let cursor: string | undefined;
  let scanned = 0;
  let created = 0;

  while (true) {
    const page = await db.tool.findMany({
      where: {
        type: ToolType.Template,
        searchMetadata: {
          is: null,
        },
      },
      select: {
        id: true,
        slug: true,
      },
      orderBy: {
        id: "asc",
      },
      take: TAKE,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    if (page.length === 0) break;

    scanned += page.length;

    for (let i = 0; i < page.length; i += BATCH) {
      const chunk = page.slice(i, i + BATCH);

      const result = await db.toolSearchMetadata.createMany({
        data: chunk.map((tool) => ({
          toolId: tool.id,
        })),
        skipDuplicates: true,
      });

      created += result.count;

      if (created % LOG_EVERY === 0 || result.count > 0) {
        console.log(`[tool-search-metadata] scanned=${scanned} created=${created} last=${chunk[chunk.length - 1]?.slug}`);
      }
    }

    cursor = page[page.length - 1]?.id;
  }

  console.log(`[tool-search-metadata] done scanned=${scanned} created=${created}`);
}

main()
  .catch((error) => {
    console.error("[tool-search-metadata] failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
