// server/web/ads/payload.ts
import { Prisma } from "@prisma/client";

export const adManyPayload: Prisma.AdSelect = {
  id: true,
  name: true,
  description: true,
  websiteUrl: true,
  affiliateUrl: true,
  buttonLabel: true,
  faviconUrl: true,
  type: true,
  startsAt: true,
  endsAt: true,
};
