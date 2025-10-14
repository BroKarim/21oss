import { Prisma } from "@prisma/client";
import { ToolManyPayload } from "../tools/payloads";

export const CuratedListPayload = Prisma.validator<Prisma.CuratedListSelect>()({
  id: true,
  title: true,
  description: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  tools: {
    select: ToolManyPayload,
  },
});

export type CuratedListMany = Prisma.CuratedListGetPayload<{
  select: typeof CuratedListPayload;
}>;
