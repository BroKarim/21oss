import { Prisma } from "@prisma/client";

export const ContentManyPayload = Prisma.validator<Prisma.ContentSelect>()({
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  screenshotUrl:true,
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
  inspiredBy: {
    select: {
      name: true,
      slug: true,
      iconUrl: true,
    },
  },
});

export type ContentMany = Prisma.ContentGetPayload<{
  select: typeof ContentManyPayload;
}>;
