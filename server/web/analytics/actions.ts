"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createServerActionProcedure } from "zsa";
import { db } from "@/services/db";
import { AnalyticsEventType } from "@prisma/client";

// Public procedure (tidak butuh login) untuk tracking
const publicProcedure = createServerActionProcedure().handler(async () => {
  const h = await headers();
  return {
    userAgent: h.get("user-agent") ?? undefined,
    referrer: h.get("referer") ?? undefined,
  };
});

const trackEventSchema = z.object({
  type: z.nativeEnum(AnalyticsEventType),
  url: z.string().min(1),
  toolId: z.string().optional(),
  adId: z.string().optional(),
  country: z.string().optional(),
});

/**
 * trackEvent — dipanggil dari client component saat user klik tool atau iklan.
 * Menyimpan event ke tabel AnalyticsEvent.
 */
export const trackEvent = publicProcedure
  .createServerAction()
  .input(trackEventSchema)
  .handler(async ({ input, ctx }) => {
    await db.analyticsEvent.create({
      data: {
        type: input.type,
        url: input.url,
        toolId: input.toolId,
        adId: input.adId,
        country: input.country,
        referrer: ctx.referrer,
        userAgent: ctx.userAgent,
      },
    });
  });
