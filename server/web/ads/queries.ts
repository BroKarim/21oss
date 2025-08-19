// server/web/ads/queries.ts
import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { adManyPayload, adOnePayload } from "./payloads";

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
    select: adManyPayload,
  });
};

// Ambil semua iklan (tanpa filter aktif)
export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache";

  cacheTag("ads");
  cacheLife("hours");

  return db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adManyPayload,
  });
};

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  "use cache";

  cacheTag("ads");
  cacheLife("minutes");

  return db.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  });
};
