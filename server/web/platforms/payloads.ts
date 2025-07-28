import { Prisma, ToolStatus } from "@prisma/client";

/* ---------- Helpers ---------- */

/** Digunakan untuk mem‑filter hanya platform yang punya tool ber‑status Published */
export const platformWithTools = Prisma.validator<Prisma.PlatformWhereInput>()({
  tools: { some: { status: ToolStatus.Published } },
});

/* ---------- SELECT payloads ---------- */

export const platformOnePayload = Prisma.validator<Prisma.PlatformSelect>()({
  id: true,
  name: true,
  slug: true,
  iconUrl: true,
  _count: {
    select: {
      tools: { where: { status: ToolStatus.Published } },
    },
  },
});

export const platformManyPayload = Prisma.validator<Prisma.PlatformSelect>()({
  name: true,
  slug: true,
  iconUrl: true,
  _count: {
    select: {
      tools: { where: { status: ToolStatus.Published } },
    },
  },
});

/* ---------- Type helpers ---------- */

export type PlatformOne = Prisma.PlatformGetPayload<{
  select: typeof platformOnePayload;
}>;

export type PlatformMany = Prisma.PlatformGetPayload<{
  select: typeof platformManyPayload;
}>;
