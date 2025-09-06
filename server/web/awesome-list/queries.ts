// server/web/awesome-list/queries.ts
import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { awesomeManyPayload } from "./payloads";
import type { AwesomeFilterSchema } from "./schema";

export const searchAwesomeLists = async (search: AwesomeFilterSchema, where?: Prisma.AwesomeListWhereInput) => {
  "use cache";

  cacheTag("awesome-lists");
  cacheLife("max");

  const { q, page, sort, perPage, category } = search;
  const skip = (page - 1) * perPage;
  const take = perPage;

  let orderBy: Prisma.AwesomeListFindManyArgs["orderBy"] = { stars: "desc" };
  if (sort && sort !== "default") {
    const [sortBy, sortOrder] = sort.split(".") as [string, "asc" | "desc"];
    orderBy = { [sortBy]: sortOrder };
  }

  const whereQuery: Prisma.AwesomeListWhereInput = {
    ...(!!category.length && { category: { in: category } }),
  };

  if (q) {
    whereQuery.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { owner: { contains: q, mode: "insensitive" } }];
  }

  const [awesomeLists, totalCount] = await db.$transaction([
    db.awesomeList.findMany({
      where: { ...whereQuery, ...where },
      select: awesomeManyPayload,
      orderBy,
      take,
      skip,
    }),
    db.awesomeList.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(totalCount / perPage);
  return { awesomeLists, totalCount, pageCount };
};

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
