"use server";

import { db } from "@/services/db";

export const findTweetedTools = async ({ take = 50 }: { take?: number } = {}) => {
  return db.tool.findMany({
    where: { status: "Published", isTweeted: true },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      name: true,
      slug: true,
      stars: true,
      websiteUrl: true,
      repositoryUrl: true,
      screenshotUrl: true,
      screenshots: { select: { imageUrl: true, order: true }, orderBy: { order: "asc" } },
      stacks: { select: { name: true, slug: true } },
      updatedAt: true,
    },
  });
};

export const findTweetCandidates = async ({ take = 3 }: { take?: number } = {}) => {
  return db.tool.findMany({
    where: { status: "Published", isTweeted: false },
    orderBy: [{ publishedAt: "desc" }, { stars: "desc" }],
    take,
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      description: true,
      stars: true,
      forks: true,
      websiteUrl: true,
      repositoryUrl: true,
      screenshotUrl: true,
      screenshots: { select: { imageUrl: true, order: true }, orderBy: { order: "asc" } },
      stacks: { select: { name: true, slug: true } },
    },
  });
};
