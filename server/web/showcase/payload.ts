// server/web/showcase/payload.ts

import { Prisma } from "@prisma/client";

//mengambil field tertentu saat query (hemat bandwidth)
export const ContentManyPayload = Prisma.validator<Prisma.ContentSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  faviconUrl: true,
  screenshotUrl: true,
  stars: true,
  license: {
    select: {
      name: true,
      slug: true,
    },
  },
  platforms: {
    select: {
      name: true,
      slug: true,
    },
  },
  _count: { select: { likes: true } },
});

//tipe TypeScript untuk hasil dari query tersebut, jadi kamu dapat manfaat auto-complete dan validasi.
export type ContentMany = Prisma.ContentGetPayload<{
  select: typeof ContentManyPayload;
}>;
