import { Prisma } from "@prisma/client";

//field apa saja yg diambil dari categories
export const categoryManyPayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  label: true,
  fullPath: true,
  _count: { select: { tools: true } },
});
