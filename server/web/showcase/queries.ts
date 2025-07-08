import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ContentManyPayload, contentOnePayload } from "./payload";

//nengok sini : https://github.com/piotrkulpinski/openalternative/blob/e47d2d295dc9ae8575fefdc3cfaf6e8baa2ff94c/server/web/tools/queries.ts
// sederhanya ini fitur fetch data

export const findFeaturedShowcase = async ({ where, ...args }: Prisma.ContentFindManyArgs = {}) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return await findShowcases({
    where: {
      stars: { gt: 0 },
      ...where,
    },
    orderBy: {
      stars: "desc",
    },
    take: 10, // ambil 10 konten dengan bintang terbanyak
    ...args,
  });
};

// Mengambil semua data dari model content, dengan kondisi dan urutan tertentu.
export const findShowcases = async ({ where, orderBy, ...args }: Prisma.ContentFindManyArgs) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");

  return db.content.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...where },
    select: ContentManyPayload, //membatasi hanya field tertentu yang diambil
  });
};

export const findShowcaseSlugs = async ({ where, orderBy, ...args }: Prisma.ContentFindManyArgs) => {
  "use cache";

  cacheTag("showcases");
  cacheLife("max");

  return db.content.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...where },
    select: { slug: true, updatedAt: true },
  });
};

export const findShowcase = async ({ where, ...args }: Prisma.ContentFindFirstArgs = {}) => {
  "use cache";

  cacheTag("showcase", `showcase-${where?.slug}`);
  cacheLife("max");
  console.log("findShowcase args:", args);
  return db.content.findFirst({
    ...args,

    where: { ...where },
    select: contentOnePayload,
  });
};
