"use server";
import type { Prisma } from "@prisma/client";
import { db } from "@/services/db";

export const findPlatformList = async ({ ...args }: Prisma.PlatformFindManyArgs = {}) => {
  return db.platform.findMany({
    ...args,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
};
