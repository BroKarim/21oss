import { db } from "@/services/db";
import { unstable_cache as cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { CuratedListPayload } from "./payloads";

export const findCuratedLists = cache(
  async ({ where, ...args }: Prisma.CuratedListFindManyArgs = {}) => {
    console.log("Fetching curated lists from database (cache miss)...");

    return db.curatedList.findMany({
      ...args,
      where,
      orderBy: { createdAt: "desc" },
      select: CuratedListPayload,
    });
  },
  ["curated-lists"],
  {
    tags: ["curated-lists"],
    revalidate: 3600,
  }
);

// export const findCuratedListById = async (id: string) => {
//   "use cache";

//   cacheTag("curated-list");
//   cacheLife("max");

//   return db.curatedList.findUnique({
//     where: { id },
//     select: CuratedListPayload,
//   });
// };
