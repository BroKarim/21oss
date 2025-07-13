import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ToolManyPayload, toolOnePayload } from "./payloads";

// sederhanya ini fungsi2 untuk fetch data mirip seperti API GET

export const findFeaturedTool = async ({ where, ...args }: Prisma.ToolFindManyArgs = {}) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return await findTools({
    where: {
      stars: { gt: 0 },
      ...where,
    },
    orderBy: {
      stars: "desc",
    },
    take: 10, // ambil 10 konten dengan bintang terbanyak
    ...args,
  });
};

// Mengambil semua data dari model content, dengan kondisi dan urutan tertentu.
export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...where },
    select: ToolManyPayload, //membatasi hanya field tertentu yang diambil
  });
};

export const findToolslugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("showcases");
  cacheLife("max");

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...where },
    select: { slug: true, updatedAt: true },
  });
};

export const findTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs = {}) => {
  "use cache";

  cacheTag("showcase", `showcase-${where?.slug}`);
  cacheLife("max");
  console.log("findTool args:", args);
  return db.tool.findFirst({
    ...args,

    where: { ...where },
    select: toolOnePayload,
  });
};
