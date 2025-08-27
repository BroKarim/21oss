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
  discountCode: true,
  discountAmount: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  license: true,
  stacks: {
    select: stackManyPayload,
  },
  categories: toolCategoriesPayload,
  inspiredBy: {
    select: {
      name: true,
      slug: true,
      iconUrl: true,
    },
  },
  screenshots: {
    select: {
      id: true,
      imageUrl: true,
      order: true,
      caption: true,
    },
  },
});

export const ToolManyPayload: Prisma.ToolSelect = {
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  screenshotUrl: true,
  tagline: true,
  description: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  discountCode: true,
  discountAmount: true,
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
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
};

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
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
