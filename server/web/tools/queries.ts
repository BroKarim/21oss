import { type Prisma, ToolStatus, ToolType } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ToolListPayload } from "./payloads";
import type { ResourcesParams } from "../shared/schema";
import { FEATURED_STACK } from "./config";

export const findStackFilters = async () => {
  "use cache";
  cacheTag("stack-filters"); 
  cacheLife("max"); 

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const featuredKeys = FEATURED_STACK.map(normalize);

  const stacks = await db.stack.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      faviconUrl: true, 
      slug: true,
    },
  });

  const stackByKey = new Map<string, (typeof stacks)[number]>();
  for (const stack of stacks) {
    const key = normalize(stack.slug || stack.name);
    if (!stackByKey.has(key)) {
      stackByKey.set(key, stack);
    }
  }

  const featuredStacks = featuredKeys
    .map((key) => stackByKey.get(key))
    .filter((stack): stack is (typeof stacks)[number] => Boolean(stack));
  return featuredStacks;
};

function buildResourcesWhere({ type, stack, templateType }: Pick<ResourcesParams, "type" | "stack" | "templateType">): Prisma.ToolWhereInput {
  const stackSlugs = stack?.split(",").filter(Boolean) ?? [];

  return {
    status: ToolStatus.Published,

    ...(type === "all"
      ? {
          type: {
            in: [ToolType.Template, ToolType.Component, ToolType.Asset],
          },
        }
      : { type }),

    ...(type === ToolType.Template && templateType && templateType !== "all" ? { templateType } : {}),

    ...(stackSlugs.length
      ? {
          stacks: {
            some: {
              slug: {
                in: stackSlugs,
              },
            },
          },
        }
      : {}),
  };
}

export const countResources = async (params: ResourcesParams): Promise<number> => {
  "use cache";
  cacheTag("resources");
  cacheLife("max");

  return db.tool.count({
    where: buildResourcesWhere(params),
  });
};
const RESOURCES_PER_PAGE = 24;

export const findResources = async ({ type, sort, stack, templateType }: ResourcesParams, { take = RESOURCES_PER_PAGE, cursor }: { take?: number; cursor?: string } = {}) => {
  "use cache";

  cacheTag("resources");
  cacheLife("max");

  // =====================
  // WHERE (HARD FILTER)
  // =====================
  const where = buildResourcesWhere({ type, stack, templateType });
  const stackSlugs = stack?.split(",").filter(Boolean) ?? [];

  // =====================
  // ORDER BY (DB LEVEL)
  // =====================
  let orderBy: Prisma.ToolOrderByWithRelationInput[];

  switch (sort) {
    case "latest":
      orderBy = [{ lastCommitDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }];
      break;
    case "oldest":
      orderBy = [{ firstCommitDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }];
      break;
    case "name_asc":
      orderBy = [{ name: "asc" }, { createdAt: "desc" }, { id: "desc" }];
      break;
    case "name_desc":
      orderBy = [{ name: "desc" }, { createdAt: "desc" }, { id: "desc" }];
      break;
    case "forks":
      orderBy = [{ forks: "desc" }, { createdAt: "desc" }, { id: "desc" }];
      break;
    case "stars":
      orderBy = [{ stars: "desc" }, { createdAt: "desc" }, { id: "desc" }];
      break;
    default:
      orderBy = [{ createdAt: "desc" }, { id: "desc" }];
  }

  // =====================
  // QUERY dengan pagination
  // =====================
  const tools = await db.tool.findMany({
    where,
    orderBy,
    select: ToolListPayload,
    take: take + 1, // ambil 1 extra untuk cek apakah masih ada data
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = tools.length > take;
  const items = hasMore ? tools.slice(0, take) : tools;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  // =====================
  // SOFT RANKING (STACK)
  // =====================
  if (!stackSlugs.length) return { items, nextCursor, hasMore };

  const ranked = items
    .map((tool) => {
      const matchedStacks = tool.stacks.filter((s) => stackSlugs.includes(s.slug)).length;
      return { ...tool, _score: matchedStacks };
    })
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return (b.stars ?? 0) - (a.stars ?? 0);
    });

  return { items: ranked, nextCursor, hasMore };
};
