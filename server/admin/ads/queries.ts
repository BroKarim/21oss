"use server";

import { isTruthy } from "@primoui/utils";
import { type Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "@/services/db";
import type { AdsTableSchema } from "./schema";

export const findAds = async (search: AdsTableSchema, where?: Prisma.AdWhereInput) => {
  const { name, sort, page, perPage, from, to, operator } = search;

  const offset = (page - 1) * perPage;

  const orderBy = sort.map((item:any) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.AdWhereInput | undefined)[] = [name ? { name: { contains: name, mode: "insensitive" } } : undefined, fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined];

  const whereQuery: Prisma.AdWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  // Transaction supaya query data & count tetap konsisten
  const [ads, adsTotal] = await db.$transaction([
    db.ad.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.ad.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(adsTotal / perPage);
  return { ads, adsTotal, pageCount };
};

export const findAdById = async (id: string) => {
  console.log("findAdById received id:", id);
  return db.ad.findUnique({
    where: { id },
  });
};
