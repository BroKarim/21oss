import { Prisma, ToolStatus } from "@prisma/client";

export const platformWithTools = Prisma.validator<Prisma.PlatformWhereInput>()({
  tools: { some: { status: ToolStatus.Published } },
});

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

export type PlatformOne = Prisma.PlatformGetPayload<{
  select: typeof platformOnePayload;
}>;

export type PlatformMany = Prisma.PlatformGetPayload<{
  select: typeof platformManyPayload;
}>;
