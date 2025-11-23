"use server";

import { db } from "@/services/db";
import { type Prisma } from "@prisma/client";
import type { FreeStuffTableSchema } from "./schema";

export const findFreeStuff = async (search: FreeStuffTableSchema, where?: Prisma.DevPerkWhereInput) => {
  const { name, type, sort, page, perPage } = search;

  const offset = (page - 1) * perPage;

  const orderBy = sort.map(
    (item) =>
      ({
        [item.id]: item.desc ? "desc" : "asc",
      }) as const
  );

  const expressions: Prisma.DevPerkWhereInput[] = [];

  if (name) {
    expressions.push({
      name: { contains: name, mode: "insensitive" },
    });
  }

  if (type && type.length > 0) {
    expressions.push({
      type: { in: type },
    });
  }

  const whereQuery: Prisma.DevPerkWhereInput = expressions.length > 0 ? { AND: expressions } : {};

  const [items, total] = await db.$transaction([
    db.devPerk.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),
    db.devPerk.count({ where: { ...whereQuery, ...where } }),
  ]);

  const pageCount = Math.ceil(total / perPage);

  return { items, total, pageCount };
};

export const findStuffById = async (id: string) => {
  return db.devPerk.findUnique({
    where: { id },
  });
};

export const findFreeStuffBySlug = async (slug: string) => {
  return db.devPerk.findUnique({
    where: { slug },
  });
};


export async function getAllUniqueTags() {
  const allData = await db.devPerk.findMany({
    select: {
      tags: true,
    },
  });

  const flattenedTags = allData.flatMap((item: any) => item.tags);
  const uniqueTags = Array.from(new Set(flattenedTags));
  return uniqueTags.sort();
}

