import { type Prisma, ToolStatus } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ToolManyPayload, toolOnePayload } from "./payloads";

// sederhanya ini fungsi2 untuk fetch data mirip seperti API GET

export const findFeaturedTool = async ({ where, ...args }: Prisma.ToolFindManyArgs = {}) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return await findTools({
    where: { status: ToolStatus.Published, ...where },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    ...args,
  });
};

// Mengambil semua data dari model content, dengan kondisi dan urutan tertentu.
export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");
  console.log(await db.tool.findMany({ take: 5, orderBy: { createdAt: "desc" } }));
  console.log("🔍 where:", where);

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

  return db.tool.findFirst({
    ...args,
    where: { ...where },
    select: toolOnePayload,
  });
};
