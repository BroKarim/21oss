import { db } from "@/services/db";
import { unstable_cache as cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { DevPerkCardPayload } from "./payloads";

type FindPerksArgs = Prisma.DevPerkFindManyArgs & {
  search?: string;
};

export const findFreeStuffPerks = cache(
  async ({ search, where, ...args }: FindPerksArgs = {}) => {
    const searchFilter: Prisma.DevPerkWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }],
        }
      : {};
    return db.devPerk.findMany({
      ...args,
      where: {
        ...where,
        ...searchFilter,
      },
      orderBy: { createdAt: "desc" },
      select: DevPerkCardPayload,
    });
  },
  ["free-stuff-perks"],
  {
    tags: ["free-stuff"],
    revalidate: 3600,
  }
);

export const findPerkBySlug = cache(
  async (slug: string) => {
    return db.devPerk.findUnique({
      where: { slug },
    });
  },
  ["perk-detail"],
  {
    tags: ["free-stuff"],
    revalidate: 3600,
  }
);
