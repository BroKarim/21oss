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

// Type Definitions
export type DevPerkCard = Prisma.DevPerkGetPayload<{
  select: typeof DevPerkCardPayload;
}>;
