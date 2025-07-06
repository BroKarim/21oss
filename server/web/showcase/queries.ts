import { type Prisma } from "@prisma/client";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { db } from "@/services/db";
import { ContentManyPayload } from "./payload";

//nengok sini : https://github.com/piotrkulpinski/openalternative/blob/e47d2d295dc9ae8575fefdc3cfaf6e8baa2ff94c/server/web/tools/queries.ts
// sederhanya ini fitur fetch data
// Prisma.ContentFindManyArgs = prisma.content.findMany()
export const findFeaturedShowcase = async ({ where, ...args }: Prisma.ContentFindManyArgs) => {
  "use cache";

  cacheTag("showcase");
  cacheLife("max");
  // list berisi slug konten yang dianggap “featured”
  const list = ["monday", "notion", "airtable", "typeform", "teamwork", "todoist", "kissmetrics", "fathom-analytics"];

  // Menggunakan findShowcase di bawahnya untuk fetch datanya
  return await findShowcase({
    where: { slug: { in: list }, ...where },
    ...args,
  });
};

// Mengambil semua data dari model content, dengan kondisi dan urutan tertentu.
export const findShowcase = async ({ where, orderBy, ...args }: Prisma.ContentFindManyArgs) => {
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
