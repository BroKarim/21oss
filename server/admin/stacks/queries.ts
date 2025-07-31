import type { Prisma } from "@prisma/client";
import { db } from "@/services/db";
import type { StacksTableSchema } from "./schema";

// Utility: filter out undefined/null
const isTruthy = <T>(value: T): value is Exclude<T, null | undefined | false> => value !== undefined && value !== null && value !== false;

/**
 * List stack untuk tabel admin (dengan filter/search/sort)
 */
export const findStacks = async (search: StacksTableSchema) => {
  const { name, type, page, perPage, sort, operator } = search;

  const offset = (page - 1) * perPage;
  const orderBy = sort.map((item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const);

  const expressions: (Prisma.StackWhereInput | undefined)[] = [name ? { name: { contains: name, mode: "insensitive" } } : undefined, type ? { type } : undefined];

  const where: Prisma.StackWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [stacks, stacksTotal] = await db.$transaction([
    db.stack.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.stack.count({
      where,
    }),
  ]);

  const pageCount = Math.ceil(stacksTotal / perPage);
  return { stacks, stacksTotal, pageCount };
};

/**
 * Untuk combobox/autocomplete stack
 */
export const findStackList = async ({ ...args }: Prisma.StackFindManyArgs = {}) => {
  return db.stack.findMany({
    ...args,
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
};

/**
 * Untuk menampilkan 1 stack secara detail (opsional)
 */
export const findStackBySlug = async (slug: string) => {
  return db.stack.findUnique({
    where: { slug },
    include: {
      tools: { select: { id: true, name: true } },
    },
  });
};
