import { db } from "@/services/db";
import { adManyPayload } from "./payloads";
import { AdType } from "@prisma/client";

/**
 * Mengambil semua iklan yang sedang aktif (berdasarkan tanggal).
 * Filter tipe dilakukan di sisi pemanggil jika diperlukan.
 */
export const getActiveAds = async () => {
  const now = new Date();
  const ads = await db.ad.findMany({
    where: {
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    select: adManyPayload,
    orderBy: { startsAt: "asc" },
  });

  return ads;
};

/**
 * Mengambil iklan aktif berdasarkan AdType tertentu.
 */
export const getActiveAdsByType = async (type: AdType) => {
  const now = new Date();
  return db.ad.findMany({
    where: {
      type,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    select: adManyPayload,
    orderBy: { startsAt: "asc" },
  });
};
