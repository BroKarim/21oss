import { Prisma } from "@prisma/client";
import { categoryManyPayload } from "../categories/payload";

export const contentCategoriesPayload = Prisma.validator<Prisma.Content$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" }, //hasilnya bakal asc
});

export const contentOnePayload = Prisma.validator<Prisma.ContentSelect>()({
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
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  license: true,
  categories: contentCategoriesPayload,
  inspiredBy: {
    select: {
      name: true,
      slug: true,
      iconUrl: true,
    },
  },
});

export const ContentManyPayload = Prisma.validator<Prisma.ContentSelect>()({
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
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type ContentOne = Prisma.ContentGetPayload<{ select: typeof contentOnePayload }>;
export type ContentMany = Prisma.ContentGetPayload<{
  select: typeof ContentManyPayload;
}>;
