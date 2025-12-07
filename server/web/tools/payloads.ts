import { Prisma } from "@prisma/client";
import { categoryManyPayload } from "../categories/payloads";
import { stackManyPayload } from "../stacks/payloads";

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
});

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  repositoryUrl: true,
  tagline: true,
  description: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  license: true,
  stacks: {
    select: stackManyPayload,
  },
  categories: toolCategoriesPayload,
  screenshots: {
    select: {
      id: true,
      imageUrl: true,
      order: true,
      caption: true,
    },
  },
});

export const ToolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  repositoryUrl: true,
  affiliateUrl: true,
  tagline: true,
  description: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  license: true,
  updatedAt: true,
  categories: toolCategoriesPayload,
  stacks: {
    select: stackManyPayload,
  },
  screenshots: {
    select: {
      id: true,
      imageUrl: true,
      order: true,
      caption: true,
    },
  },
  platforms: {
    select: {
      id: true,
      name: true,
    },
  },
});

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  description: true,

  faviconUrl: true,

  firstCommitDate: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  categories: toolCategoriesPayload,
});

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>;
export type ToolMany = Prisma.ToolGetPayload<{
  select: typeof ToolManyPayload;
}>;
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>;
