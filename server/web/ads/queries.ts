// server/web/ads/queries.ts
import { type Prisma } from "@prisma/client";
import { db } from "@/services/db";
import { adOnePayload } from "./payloads";

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  return db.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  });
};
