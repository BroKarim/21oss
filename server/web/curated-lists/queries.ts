import { db } from "@/services/db";
import { unstable_cache as cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { CuratedListDetailPayload, CuratedListCardPayload } from "./payloads";

export const findCuratedLists = cache(
  async ({ where, ...args }: Prisma.CuratedListFindManyArgs = {}) => {
    console.log("Fetching curated lists from database (cache miss)...");

    return db.curatedList.findMany({
      ...args,
      where,
      orderBy: { createdAt: "desc" },
      select: CuratedListCardPayload,
    });
  },
  ["curated-lists"],
  {
    tags: ["curated-lists"],
    revalidate: 3600,
  }
);

export const findCuratedListByUrl = cache(
  async (url: string) => {
    return db.curatedList.findUnique({
      where: { url }, 
      select: CuratedListDetailPayload, 
    });
  },
  ["curated-list-detail"], 
  {
    revalidate: 3600,
  }
);
