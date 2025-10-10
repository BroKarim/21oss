import { Prisma } from "@prisma/client";
import { ToolManyPayload } from "../tools/payloads"; // reuse tools payload

export const CuratedListPayload: Prisma.CuratedListSelect = {
  id: true,
  title: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  tools: {
    select: ToolManyPayload,
  },
};

export type CuratedListMany = Prisma.CuratedListGetPayload<{
  select: typeof CuratedListPayload;
}>;
