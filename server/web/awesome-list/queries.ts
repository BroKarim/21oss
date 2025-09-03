// server/web/awesome-list/queries.ts
import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { awesomeManyPayload } from "./payloads";

export const findAwesomeLists = async ({ where, orderBy, ...args }: Prisma.AwesomeListFindManyArgs = {}) => {
  "use cache";

  cacheTag("awesome-lists");
  cacheLife("hours");

  return db.awesomeList.findMany({
    ...args,
    orderBy: orderBy ?? { stars: "desc" }, // default sort by stars
    where: {
      ...where,
    },
    select: awesomeManyPayload,
  });
};
