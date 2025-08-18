// server/web/ads/payload.ts
import { Prisma } from "@prisma/client";

export const AdManyPayload: Prisma.AdSelect = {
  id: true,
  name: true,
  description: true,
  websiteUrl: true,
  affiliateUrl: true,
  imageUrl: true,
  buttonLabel: true,
  faviconUrl: true,
  type: true,
  startsAt: true,
  endsAt: true,
  createdAt: true,
  updatedAt: true,
};

export const AdOnePayload: Prisma.AdSelect = {
  ...AdManyPayload,
};