import { isTruthy } from "@primoui/utils";
import type { Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { CategoriesTableSchema } from "./schema";

export const findCategories = async (search: CategoriesTableSchema) => {
  const { name, page, perPage, sort, from, to, operator } = search;

  const offset = (page - 1) * perPage;
  const orderBy = sort.map((item: any) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.CategoryWhereInput | undefined)[] = [name ? { name: { contains: name, mode: "insensitive" } } : undefined, fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined];

  const where: Prisma.CategoryWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [categories, categoriesTotal] = await db.$transaction([
    db.category.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.category.count({
      where,
    }),
  ]);

  const pageCount = Math.ceil(categoriesTotal / perPage);
  return { categories, categoriesTotal, pageCount };
};

export const findCategoryList = async ({ ...args }: Prisma.CategoryFindManyArgs = {}) => {
  return db.category.findMany({
    ...args,
    select: { id: true, name: true, fullPath: true, parentId: true },
    orderBy: { name: "asc" },
  });
};

export const findCategoryBySlug = async (slug: string) => {
  return db.category.findUnique({
    where: { slug },
    include: {
      tools: { select: { id: true, name: true } },
      subcategories: { select: { id: true, name: true } },
    },
  });
};
