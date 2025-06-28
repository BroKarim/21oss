import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { db: PrismaClient };

export const db = globalForPrisma.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;
