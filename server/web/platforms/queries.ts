// src/server/web/platforms/queries.ts

import { type Prisma, ToolStatus } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { platformManyPayload, platformOnePayload } from "@/server/web/platforms/payloads";

// Untuk listing semua platform (misalnya di halaman eksplorasi)
export const findPlatforms = async ({ where, orderBy, ...args }: Prisma.PlatformFindManyArgs = {}) => {
  "use cache";

  cacheTag("platforms");
  cacheLife("max");

  return db.platform.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: platformManyPayload,
  });
};

// Untuk pre-generasi dynamic route atau breadcrumb
export const findPlatformSlugs = async ({ orderBy, ...args }: Prisma.PlatformFindManyArgs = {}) => {
  "use cache";

  cacheTag("platforms");
  cacheLife("max");

  return db.platform.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    select: { slug: true, updatedAt: true },
  });
};

// Untuk halaman detail platform
export const findPlatformBySlug = async (slug: string) => {
  "use cache";

  cacheTag("platform", `platform-${slug}`);
  cacheLife("max");

  const platform = await db.platform.findFirst({
    where: { slug },
    select: platformOnePayload,
  });

  console.log("findPlatformBySlug: Found platform:", platform);

  return platform;
};
