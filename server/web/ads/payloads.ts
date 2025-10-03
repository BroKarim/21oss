// server/web/ads/payload.ts
import { Prisma } from "@prisma/client";

export const adManyPayload: Prisma.AdSelect = {
  id: true,
  name: true,
  description: true,
  websiteUrl: true,
  buttonLabel: true,
  faviconUrl: true,
  type: true,
  startsAt: true,
  endsAt: true,
};

export const adOnePayload = Prisma.validator<Prisma.AdSelect>()({
  name: true,
  description: true,
  websiteUrl: true,
  imageUrl: true,
  buttonLabel: true,
  faviconUrl: true,
  type: true,
});

export type AdOne = Prisma.AdGetPayload<{ select: typeof adOnePayload }>;
