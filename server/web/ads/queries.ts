// server/web/ads/queries.ts
import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { AdManyPayload, AdOnePayload } from "./payloads";

// Ambil semua iklan yg aktif (berdasarkan startDate & endDate)
export const findActiveAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs = {}) => {
  "use cache";

  cacheTag("ads");
  cacheLife("max");

  const now = new Date();

  return db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: {
      ...where,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    select: AdManyPayload,
  });
};

// Ambil semua iklan (tanpa filter aktif)
export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs = {}) => {
  "use cache";

  cacheTag("ads");
  cacheLife("max");

  return db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { createdAt: "desc" },
    where: { ...where },
    select: AdManyPayload,
  });
};

export const findAd = async (where: Prisma.AdWhereUniqueInput) => {
  "use cache";

  cacheTag("ads");
  cacheLife("max");

  return db.ad.findUnique({
    where,
    select: AdOnePayload,
  });
};
