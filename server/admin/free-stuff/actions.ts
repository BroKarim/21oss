"use server";

import { slugify } from "@primoui/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { freeStuffSchema } from "./schema";

/* ============================================================
   UPSERT: create / update DevPerk
   ============================================================ */
export const upsertFreeStuff = adminProcedure
  .createServerAction()
  .input(freeStuffSchema)
  .handler(async ({ input }) => {
    const { id, tags, ...rest } = input;

    const slug = rest.slug || slugify(rest.name);

    const tagStrings = tags?.map((t) => t.value) ?? [];

    const item = id
      ? await db.devPerk.update({
          where: { id },
          data: { ...rest, slug, tags: tagStrings },
        })
      : await db.devPerk.create({
          data: { ...rest, slug, tags: tagStrings },
        });

    revalidateTag("free-stuff");
    revalidateTag(`free-stuff-${item.slug}`);

    return item;
  });

/* ============================================================
   DELETE
   ============================================================ */
export const deleteFreeStuff = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const items = await db.devPerk.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    });

    if (items.length === 0) throw new Error("No items found to delete");

    const result = await db.devPerk.deleteMany({
      where: { id: { in: ids } },
    });

    // revalidate
    revalidatePath("/admin/free-stuff");
    revalidateTag("free-stuff");

    return result;
  });
