"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { adSchema } from "./schema";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { removeS3Directories } from "@/lib/media";

export const upsertAd = adminProcedure
  .createServerAction()
  .input(adSchema)
  .handler(async ({ input }) => {
    console.log("✅ upsertAd called", input);
    const { id, startsAt, endsAt, ...rest } = input;

    const formattedData = {
      ...rest,
      startsAt: startsAt ? new Date(startsAt) : new Date(),
      endsAt: endsAt ? new Date(endsAt) : new Date(),
    };

    const ad = id
      ? await db.ad.update({
          where: { id },
          data: formattedData,
        })
      : await db.ad.create({
          data: formattedData,
        });

    console.info(`[UPSERTAD] done, id=${ad.id}`);

    revalidateTag("ads");
    revalidateTag(`ad-${ad.id}`);

    return ad;
  });

export const deleteAds = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    // ambil data ads yang mau dihapus
    const ads = await db.ad.findMany({
      where: { id: { in: ids } },
      select: { imageUrl: true },
    });

    await db.ad.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/ads");
    revalidateTag("ads");

    after(async () => {
      const urls = ads.map((a) => a.imageUrl).filter(Boolean) as string[];
      await removeS3Directories(urls);
    });

    return true;
  });
