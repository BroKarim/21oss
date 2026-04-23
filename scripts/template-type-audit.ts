import "dotenv/config";

import { ToolStatus, ToolType } from "@prisma/client";
import { db } from "@/services/db";
import { classifyTemplateBucket, TEMPLATE_TYPE_RULES_VERSION } from "@/server/web/tools/template-type-rules";

type Bucket = "website" | "mobile" | "dashboard";

const TAKE = Number(process.env.TAKE ?? 500);
const SAMPLE = Number(process.env.SAMPLE ?? 20);
const LOG_LIMIT = Number(process.env.LOG_LIMIT ?? 200);

function pickTop<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  return arr.slice(0, n);
}

async function main() {
  const onlyPublished = process.argv.includes("--published");
  const includeUnpublished = process.argv.includes("--all-status");
  const showHaystack = process.argv.includes("--show-haystack");
  const log = process.argv.includes("--log");
  const noJson = process.argv.includes("--no-json");

  if (onlyPublished && includeUnpublished) {
    throw new Error("flags conflict: use one of --published or --all-status");
  }

  const whereStatus = includeUnpublished
    ? undefined
    : onlyPublished
      ? ToolStatus.Published
      : ToolStatus.Published;

  const counts: Record<Bucket, number> = { website: 0, mobile: 0, dashboard: 0 };
  const samples: Record<Bucket, { id: string; slug: string; name: string; matched: string[]; scores: { mobile: number; dashboard: number }; haystack?: string }[]> = {
    website: [],
    mobile: [],
    dashboard: [],
  };

  let lastId: string | undefined;
  let scanned = 0;
  let logged = 0;

  for (;;) {
    const page = await db.tool.findMany({
      where: {
        type: ToolType.Template,
        ...(whereStatus ? { status: whereStatus } : {}),
      },
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
        stacks: {
          select: { slug: true, name: true },
        },
      },
    });

    if (page.length === 0) break;

    for (const tool of page) {
      scanned++;
      const result = classifyTemplateBucket({
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        repositoryUrl: tool.repositoryUrl,
        stacks: tool.stacks,
      });

      counts[result.bucket]++;

      if (log && logged < LOG_LIMIT) {
        const matchedKeyword = Array.from(new Set(result.matched.map((m) => m.keyword)));
        console.log([tool.id, tool.slug, result.bucket, matchedKeyword.join(",")].join("\t"));
        logged++;
      }

      if (samples[result.bucket].length < SAMPLE) {
        samples[result.bucket].push({
          id: tool.id,
          slug: tool.slug,
          name: tool.name,
          matched: result.matched.map((m) => `${m.kind}:${m.keyword}`),
          scores: result.scores,
          ...(showHaystack ? { haystack: result.haystack } : {}),
        });
      }
    }

    lastId = page[page.length - 1]?.id;
  }

  const out = {
    meta: {
      scanned,
      take: TAKE,
      sample: SAMPLE,
      status: whereStatus ?? "ALL",
      rulesVersion: TEMPLATE_TYPE_RULES_VERSION,
    },
    counts,
    samples: {
      website: pickTop(samples.website, SAMPLE),
      mobile: pickTop(samples.mobile, SAMPLE),
      dashboard: pickTop(samples.dashboard, SAMPLE),
    },
  };

  if (!noJson) {
    console.log(JSON.stringify(out, null, 2));
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
