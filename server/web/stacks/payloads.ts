import { Prisma, ToolStatus } from "@prisma/client";

export const stackManyPayload = Prisma.validator<Prisma.StackSelect>()({
  name: true,
  slug: true,
  type: true,
  description: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
});

export type StackMany = Prisma.StackGetPayload<{ select: typeof stackManyPayload }>;
