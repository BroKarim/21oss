"use server";

import { db } from "@/services/db";
import { AnalyticsEventType } from "@prisma/client";
import { startOfDay, endOfDay, subDays } from "date-fns";

type DateRange = {
  from?: Date;
  to?: Date;
};

const defaultRange = (): DateRange => ({
  from: subDays(new Date(), 30),
  to: new Date(),
});

/**
 * Top tools berdasarkan jumlah klik (TOOL_CLICK events).
 */
export const getTopTools = async (range: DateRange = defaultRange(), limit = 10) => {
  const { from, to } = range;

  const results = await db.analyticsEvent.groupBy({
    by: ["toolId"],
    where: {
      type: AnalyticsEventType.TOOL_CLICK,
      toolId: { not: null },
      createdAt: {
        gte: from ? startOfDay(from) : undefined,
        lte: to ? endOfDay(to) : undefined,
      },
    },
    _count: { toolId: true },
    orderBy: { _count: { toolId: "desc" } },
    take: limit,
  });

  // Enrich dengan nama tool
  const toolIds = results.map((r) => r.toolId!);
  const tools = await db.tool.findMany({
    where: { id: { in: toolIds } },
    select: { id: true, name: true, slug: true, faviconUrl: true },
  });

  const toolMap = Object.fromEntries(tools.map((t) => [t.id, t]));

  return results.map((r) => ({
    tool: toolMap[r.toolId!] ?? null,
    clicks: r._count.toolId,
  }));
};

/**
 * Top ads berdasarkan jumlah klik (AD_CLICK events).
 */
export const getTopAds = async (range: DateRange = defaultRange(), limit = 10) => {
  const { from, to } = range;

  const results = await db.analyticsEvent.groupBy({
    by: ["adId"],
    where: {
      type: AnalyticsEventType.AD_CLICK,
      adId: { not: null },
      createdAt: {
        gte: from ? startOfDay(from) : undefined,
        lte: to ? endOfDay(to) : undefined,
      },
    },
    _count: { adId: true },
    orderBy: { _count: { adId: "desc" } },
    take: limit,
  });

  // Enrich dengan info ad
  const adIds = results.map((r) => r.adId!);
  const ads = await db.ad.findMany({
    where: { id: { in: adIds } },
    select: { id: true, name: true, websiteUrl: true, faviconUrl: true, type: true },
  });

  const adMap = Object.fromEntries(ads.map((a) => [a.id, a]));

  return results.map((r) => ({
    ad: adMap[r.adId!] ?? null,
    clicks: r._count.adId,
  }));
};

/**
 * Asal pengunjung berdasarkan referrer domain.
 * Mengelompokkan events berdasarkan domain referrer.
 */
export const getVisitorOrigin = async (range: DateRange = defaultRange(), limit = 10) => {
  const { from, to } = range;

  const events = await db.analyticsEvent.findMany({
    where: {
      referrer: { not: null },
      createdAt: {
        gte: from ? startOfDay(from) : undefined,
        lte: to ? endOfDay(to) : undefined,
      },
    },
    select: { referrer: true },
  });

  // Ekstrak domain dari referrer URL & hitung frekuensi
  const domainCount: Record<string, number> = {};
  for (const e of events) {
    if (!e.referrer) continue;
    try {
      const domain = new URL(e.referrer).hostname.replace(/^www\./, "");
      domainCount[domain] = (domainCount[domain] ?? 0) + 1;
    } catch {
      // Abaikan referrer yang bukan URL valid
    }
  }

  return Object.entries(domainCount)
    .map(([domain, visits]) => ({ domain, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, limit);
};

/**
 * Distribusi traffic berdasarkan jam dalam sehari (0–23).
 * Berguna untuk melihat jam-jam paling ramai kunjungan.
 */
export const getTrafficByHour = async (range: DateRange = defaultRange()) => {
  const { from, to } = range;

  const events = await db.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: from ? startOfDay(from) : undefined,
        lte: to ? endOfDay(to) : undefined,
      },
    },
    select: { createdAt: true },
  });

  // Inisialisasi semua 24 jam dengan 0
  const hourCount: Record<number, number> = Object.fromEntries(
    Array.from({ length: 24 }, (_, i) => [i, 0])
  );

  for (const e of events) {
    const hour = new Date(e.createdAt).getHours();
    hourCount[hour] = (hourCount[hour] ?? 0) + 1;
  }

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    visits: hourCount[hour] ?? 0,
  }));
};

/**
 * Summary agregat — jumlah total klik tool & iklan dalam rentang waktu.
 */
export const getAnalyticsSummary = async (range: DateRange = defaultRange()) => {
  const { from, to } = range;

  const where = {
    createdAt: {
      gte: from ? startOfDay(from) : undefined,
      lte: to ? endOfDay(to) : undefined,
    },
  };

  const [totalToolClicks, totalAdClicks, totalEvents] = await db.$transaction([
    db.analyticsEvent.count({ where: { ...where, type: AnalyticsEventType.TOOL_CLICK } }),
    db.analyticsEvent.count({ where: { ...where, type: AnalyticsEventType.AD_CLICK } }),
    db.analyticsEvent.count({ where }),
  ]);

  return { totalToolClicks, totalAdClicks, totalEvents };
};
