import { db } from "@/services/db";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { CuratedListPayload } from "./payloads";

// Ambil semua curated list terbaru
export const findCuratedLists = async ({ where, ...args }: Prisma.CuratedListFindManyArgs = {}) => {
  "use cache";

  cacheTag("curated-list");
  cacheLife("max");

  return db.curatedList.findMany({
    ...args,
    where,
    orderBy: { createdAt: "desc" },
    select: CuratedListPayload,
  });
};

// Ambil satu curated list by ID
export const findCuratedListById = async (id: string) => {
  "use cache";

  cacheTag("curated-list");
  cacheLife("max");

  return db.curatedList.findUnique({
    where: { id },
    select: CuratedListPayload,
  });
};
