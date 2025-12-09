import { db } from "@/services/db";
import { unstable_cache as cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { DevPerkCardPayload } from "./payloads";

export const findFreeStuffPerks = cache(
  async ({ where, ...args }: Prisma.DevPerkFindManyArgs = {}) => {
    return db.devPerk.findMany({
      ...args,
      where,
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
