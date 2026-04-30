import { Prisma } from "@prisma/client";
import { stackManyPayload } from "../stacks/payloads";

export const ToolListPayload = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  repositoryUrl: true,
  tagline: true,
  stars: true,
  forks: true,
  lastCommitDate: true,
  faviconUrl: true,
  stacks: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  },
  screenshots: {
    select: {
      imageUrl: true,
      order: true,
    },
    where: { order: 0 },
    take: 1,
  },
});

export type ToolList = Prisma.ToolGetPayload<{ select: typeof ToolListPayload }>;
