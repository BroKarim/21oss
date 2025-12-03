import { Prisma } from "@prisma/client";
import { ToolManyPayload } from "../tools/payloads";

export const CuratedListPayload = Prisma.validator<Prisma.CuratedListSelect>()({
  id: true,
  title: true,
  url: true,
  description: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  tools: {
    select: ToolManyPayload,
  },
});

export const CuratedListDetailPayload = Prisma.validator<Prisma.CuratedListSelect>()({
  id: true,
  title: true,
  url: true,
  description: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  tools: {
    select: ToolManyPayload,
  },
});

export const CuratedListCardPayload = Prisma.validator<Prisma.CuratedListSelect>()({
  id: true,
  title: true,
  url: true,
  description: true,
  createdAt: true,
  tools: {
    take: 3,
    select: ToolManyPayload,
  },
  _count: {
    select: {
      tools: true,
    },
  },
});

export type CuratedListMany = Prisma.CuratedListGetPayload<{
  select: typeof CuratedListPayload;
}>;

export type CuratedListCard = Prisma.CuratedListGetPayload<{
  select: typeof CuratedListCardPayload;
}>;

export type CuratedListDetail = Prisma.CuratedListGetPayload<{
  select: typeof CuratedListDetailPayload;
}>;
