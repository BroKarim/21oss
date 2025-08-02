"use server";

import { isTruthy } from "@primoui/utils";
import { type Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { ToolsTableSchema } from "./schema";

export const findTools = async (search: ToolsTableSchema, where?: Prisma.ToolWhereInput) => {
  const { name, sort, page, perPage, from, to, operator, status } = search;

  const offset = (page - 1) * perPage;

  const orderBy = sort.map((item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.ToolWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,

    status.length > 0 ? { status: { in: status } } : undefined,
  ];

  const whereQuery: Prisma.ToolWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  // Transaction is used to ensure both queries are executed in a single transaction
  const [tools, toolsTotal] = await db.$transaction([
    db.tool.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(toolsTotal / perPage);
  return { tools, toolsTotal, pageCount };
};

export const findToolList = async () => {
  return db.tool.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
};

export const findToolBySlug = async (slug: string) => {
  return db.tool.findUnique({
    where: { slug },
    include: {
      categories: true,
      platforms: true,
      stacks: true,
      screenshots: true,
    },
  });
};
