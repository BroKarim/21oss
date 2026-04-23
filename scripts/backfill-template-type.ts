import "dotenv/config";

import { Prisma, TemplateType, ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { classifyTemplateBucket, TEMPLATE_TYPE_RULES_VERSION } from "@/server/web/tools/template-type-rules";

const TAKE = Number(process.env.TAKE ?? 500);
const BATCH = Number(process.env.BATCH ?? 50);
const LOG_EVERY = Number(process.env.LOG_EVERY ?? 200);

function bucketToEnum(bucket: "website" | "mobile" | "dashboard"): TemplateType {
  switch (bucket) {
    case "website":
      return TemplateType.Website;
    case "mobile":
      return TemplateType.Mobile;
    case "dashboard":
      return TemplateType.Dashboard;
  }
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main() {
  const dryRun = hasFlag("--dry-run") || !hasFlag("--apply");
  const apply = hasFlag("--apply");
  const publishedOnly = hasFlag("--published");
  const includeNonNull = hasFlag("--include-non-null");

  if (apply && dryRun) {
    throw new Error("flags conflict: choose one of --dry-run or --apply");
  }

  const where: Prisma.ToolWhereInput = {
    type: ToolType.Template,
    ...(publishedOnly ? { status: ToolStatus.Published } : {}),
    ...(includeNonNull ? {} : { templateType: null }),
  };

  console.log(`[template-type:backfill] mode=${dryRun ? "dry-run" : "apply"} take=${TAKE} batch=${BATCH} rules=${TEMPLATE_TYPE_RULES_VERSION}`);

  let lastId: string | undefined;
  let scanned = 0;
  let updated = 0;
  const bucketCounts: Record<TemplateType, number> = {
    [TemplateType.Website]: 0,
    [TemplateType.Mobile]: 0,
    [TemplateType.Dashboard]: 0,
  };

  for (;;) {
    const page = await db.tool.findMany({
      where,
      orderBy: { id: "asc" },
      take: TAKE,
      ...(lastId ? { cursor: { id: lastId }, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        description: true,
        repositoryUrl: true,
        templateType: true,
        stacks: {
          select: { slug: true, name: true },
        },
      },
    });

    if (page.length === 0) break;

    const pending: { id: string; next: TemplateType; slug: string; matched: string[] }[] = [];

    for (const tool of page) {
      scanned++;
      const result = classifyTemplateBucket({
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        repositoryUrl: tool.repositoryUrl,
        stacks: tool.stacks,
      });

      const next = bucketToEnum(result.bucket);
      bucketCounts[next]++;

      const matchedKeyword = Array.from(new Set(result.matched.map((m) => m.keyword)));
      const shouldUpdate = includeNonNull ? tool.templateType !== next : tool.templateType == null;

      if (shouldUpdate) {
        pending.push({ id: tool.id, next, slug: tool.slug, matched: matchedKeyword });
      }

      if (scanned % LOG_EVERY === 0) {
        console.log(`[template-type:backfill] scanned=${scanned} pending=${pending.length} updated=${updated}`);
      }
    }

    if (!dryRun && pending.length > 0) {
      for (let i = 0; i < pending.length; i += BATCH) {
        const slice = pending.slice(i, i + BATCH);
        await db.$transaction(
          slice.map((row) =>
            db.tool.update({
              where: { id: row.id },
              data: { templateType: row.next },
              select: { id: true },
            })
          )
        );
        updated += slice.length;
        console.log(`[template-type:backfill] updated=${updated} (+${slice.length}) last=${slice[slice.length - 1]?.id}`);
      }
    } else if (dryRun && pending.length > 0) {
      // show small preview each page (safe)
      const preview = pending.slice(0, 5).map((r) => `${r.slug}\t${r.next}\t${r.matched.join(",")}`);
      for (const line of preview) console.log(`[dry-run] ${line}`);
    }

    lastId = page[page.length - 1]?.id;
  }

  console.log(
    JSON.stringify(
      {
        meta: { scanned, updated: dryRun ? 0 : updated, mode: dryRun ? "dry-run" : "apply", rulesVersion: TEMPLATE_TYPE_RULES_VERSION },
        buckets: bucketCounts,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
