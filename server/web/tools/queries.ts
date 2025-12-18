import { type Prisma, ToolStatus, ToolType } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ToolManyPayload, toolOnePayload } from "./payloads";
import type { FilterSchema, ResourcesParams } from "../shared/schema";

export const searchTools = async (search: FilterSchema, where?: Prisma.ToolWhereInput) => {
  "use cache";

  cacheTag("tools");
  cacheLife("max");

  const { q, page, sort, perPage, alternative, category, stack, license } = search;
  const start = performance.now();
  const skip = (page - 1) * perPage;
  const take = perPage;

  let orderBy: Prisma.ToolFindManyArgs["orderBy"] = [{ publishedAt: "desc" }];

  if (sort !== "default") {
    const [sortBy, sortOrder] = sort.split(".") as [keyof typeof orderBy, Prisma.SortOrder];
    orderBy = { [sortBy]: sortOrder };
  }

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(!!alternative.length && { alternatives: { some: { slug: { in: alternative } } } }),
    ...(!!category.length && { categories: { some: { slug: { in: category } } } }),
    ...(!!stack.length && { stacks: { some: { slug: { in: stack } } } }),
    ...(!!license.length && { license: { slug: { in: license } } }),
  };

  if (q) {
    whereQuery.OR = [{ name: { contains: q, mode: "insensitive" } }, { tagline: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  }

  const [tools, totalCount] = await db.$transaction([
    db.tool.findMany({
      where: { ...whereQuery, ...where },
      select: ToolManyPayload,
      orderBy,
      take,
      skip,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  console.log(`Tools search: ${Math.round(performance.now() - start)}ms`);

  const pageCount = Math.ceil(totalCount / perPage);
  return { tools, totalCount, pageCount };
};

export const findFeaturedTool = async ({ where, ...args }: Prisma.ToolFindManyArgs = {}) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return await findTools({
    where: { status: ToolStatus.Published, ...where },
    orderBy: {
      createdAt: "desc",
    },
    ...args,
  });
};

export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: ToolManyPayload,
  });
};

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("tools");
  cacheLife("max");

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  });
};

export const findTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs = {}) => {
  "use cache";

  cacheTag("tool", `tool-${where?.slug}`);
  cacheLife("max");

  try {
    const result = await db.tool.findFirst({
      ...args,
      where: { ...where },
      select: toolOnePayload,
    });

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const findToolsWithCategories = async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("tools");
  cacheLife("max");

  return db.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    select: ToolManyPayload,
  });
};

type FilterOptions = {
  subcategory: string;
  stack?: string[];
  q?: string;
  license?: string[];
  platform?: string[];
};

export const filterToolsBySubcategory = async ({ subcategory, stack, license, platform, q }: FilterOptions) => {
  "use cache";
  cacheTag("tools", `tools-subcat-${subcategory}`);
  cacheLife("max");

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    categories: { some: { slug: subcategory } },

    ...(stack?.length ? { stacks: { some: { slug: { in: stack } } } } : {}),
    ...(license?.length ? { license: { slug: { in: license } } } : {}),
    ...(platform?.length ? { platforms: { some: { slug: { in: platform } } } } : {}),
  };

  if (q) {
    whereQuery.OR = [{ name: { contains: q, mode: "insensitive" } }, { tagline: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  }

  return db.tool.findMany({
    where: whereQuery,
    select: ToolManyPayload,
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
};

export const findRecentTools = async ({ take = 12 }: { take?: number } = {}) => {
  return findTools({
    orderBy: { createdAt: "desc" },
    take,
  });
};

export const findToolsByStack = async (slug: string, { take = 12 }: { take?: number } = {}) => {
  return findTools({
    where: { stacks: { some: { slug } } },
    take,
  });
};


export const findResources = async (params: ResourcesParams) => {
  "use cache";
  cacheTag("resources");
  cacheLife("max");

  const { type, sortBy, stack } = await params;

  const where: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(type === "all"
      ? {
          type: {
            in: [ToolType.Template, ToolType.Component, ToolType.Asset],
          },
        }
      : { type }),
    ...(stack && {
      stacks: {
        some: {
          slug: stack,
        },
      },
    }),
  };

  const orderBy: Prisma.ToolOrderByWithRelationInput = 
    sortBy === "stars" ? { stars: "desc" } :
    sortBy === "forks" ? { forks: "desc" } :
    sortBy === "newest" ? { lastCommitDate: "desc" } :
    { firstCommitDate: "asc" }; // oldest

  return db.tool.findMany({
    where,
    select: ToolManyPayload,
    orderBy,
  });
};
