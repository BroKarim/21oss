"use server";

import { isTruthy } from "@primoui/utils";
import { type Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { AwesomeListTableSchema } from "./schema";

export const findAwesomeLists = async (search: AwesomeListTableSchema, where?: Prisma.AwesomeListWhereInput) => {
  const { name, owner, sort, page, perPage, from, to, operator, category, status } = search;

  const offset = (page - 1) * perPage;

  const orderBy = sort.map((item: any) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);

  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.AwesomeListWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,
    owner ? { owner: { contains: owner, mode: "insensitive" } } : undefined,
    category.length ? { category: { in: category } } : undefined,
    status.length ? { status: { in: status } } : undefined,
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ];

  const whereQuery: Prisma.AwesomeListWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [awesomeLists, awesomeListsTotal] = await db.$transaction([
    db.awesomeList.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),
    db.awesomeList.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(awesomeListsTotal / perPage);
  return { awesomeLists, awesomeListsTotal, pageCount };
};

export const findAwesomeListById = async (id: string) => {
  return db.awesomeList.findUnique({
    where: { id },
  });
};
