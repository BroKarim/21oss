"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { curatedListSchema } from "@/server/admin/curated-list/schema";
import { db } from "@/services/db";

export const upsertCuratedList = adminProcedure
  .createServerAction()
  .input(curatedListSchema.extend({ id: z.string().optional() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const isUpdate = !!id;
    const toolIds = tools?.map((id) => ({ id }));

    if (isUpdate) {
      const curatedList = await db.curatedList.update({
        where: { id },
        data: {
          ...input,
          tools: { set: toolIds },
        },
      });

      revalidateTag("curated-lists");

      return curatedList;
    }

    const curatedList = await db.curatedList.create({
      data: {
        ...input,
        tools: { connect: toolIds },
      },
    });

    revalidateTag("curated-lists");

    return curatedList;
  });

export const deleteCuratedLists = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.curatedList.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/curated-lists");
    revalidateTag("curated-lists");

    return true;
  });
