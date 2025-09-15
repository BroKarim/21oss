import { isTruthy } from "@primoui/utils";
import type { Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { CuratedListsTableSchema } from "./schema";

export const findCuratedLists = async (search: CuratedListsTableSchema) => {
  const { title, page, perPage, sort, from, to, operator } = search;

  const offset = (page - 1) * perPage;
  const orderBy = sort.map((item: any) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);

  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.CuratedListWhereInput | undefined)[] = [title ? { title: { contains: title, mode: "insensitive" } } : undefined, fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined];

  const where: Prisma.CuratedListWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [curatedLists, curatedListsTotal] = await db.$transaction([
    db.curatedList.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),
    db.curatedList.count({
      where,
    }),
  ]);

  const pageCount = Math.ceil(curatedListsTotal / perPage);
  return { curatedLists, curatedListsTotal, pageCount };
};
