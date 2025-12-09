import { Prisma } from "@prisma/client";

// Payload untuk Card/Table di halaman Collage
export const DevPerkCardPayload = Prisma.validator<Prisma.DevPerkSelect>()({
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  value: true,
  description: true,
  claimUrl: true,
  tags: true,
  isHot: true,
  isFree: true,
  createdAt: true,
});

// Payload untuk Detail (jika nanti butuh halaman detail terpisah misal /perks/cursor)
export const DevPerkDetailPayload = Prisma.validator<Prisma.DevPerkSelect>()({
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  value: true,
  description: true,
  claimUrl: true,
  type: true,
  tags: true,
  isFree: true,
  isHot: true,
  createdAt: true,
  updatedAt: true,
});

// Type Definitions
export type DevPerkCard = Prisma.DevPerkGetPayload<{
  select: typeof DevPerkCardPayload;
}>;

export type DevPerkDetail = Prisma.DevPerkGetPayload<{
  select: typeof DevPerkDetailPayload;
}>;
