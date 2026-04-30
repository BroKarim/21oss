import type { Prisma } from "@prisma/client";
import { db } from "@/services/db";

export const findStackList = async ({ ...args }: Prisma.StackFindManyArgs = {}) => {
  return db.stack.findMany({
    ...args,
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
};
