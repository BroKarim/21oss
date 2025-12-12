"use server";

import { isTruthy } from "@primoui/utils";
import { type Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { ResourcesTableSchema } from "./schema";

export const findResources = async (search: ResourcesTableSchema, where?: Prisma.ResourceWhereInput) => {
  const { name, sort, page, perPage, from, to, operator, category } = search;

  const offset = (page - 1) * perPage;

  const orderBy = sort.map((item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.ResourceWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,

    category.length > 0 ? { category: { in: category } } : undefined,
  ];

  const whereQuery: Prisma.ResourceWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [resources, total] = await db.$transaction([
    db.resource.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.resource.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(total / perPage);
  return { resources, total, pageCount };
};

export const findResourceById = async (id: string) => {
  return db.resource.findUnique({
    where: { id },
  });
};

export const findResourceBySlug = async (slug: string) => {
  return db.resource.findUnique({
    where: { slug },
  });
};
