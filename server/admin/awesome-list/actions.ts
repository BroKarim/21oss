"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { awesomeSchema } from "./schema";

// 🔹 Create / Update AwesomeList
export const upsertAwesome = adminProcedure
  .createServerAction()
  .input(awesomeSchema)
  .handler(async ({ input }) => {
    console.log("✅ upsertAwesome called", input);
    const { id, ...rest } = input;

    const awesome = id
      ? await db.awesomeList.update({
          where: { id },
          data: rest,
        })
      : await db.awesomeList.create({
          data: rest,
        });

    console.info(`[UPSERTAWESOME] done, id=${awesome.id}`);

    revalidateTag("awesome");
    revalidateTag(`awesome-${awesome.id}`);

    return awesome;
  });

// 🔹 Delete AwesomeList (bisa multiple)
export const deleteAwesome = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.awesomeList.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/awesome");
    revalidateTag("awesome");

    // kalau nanti ada file (misal icon/logo), bisa pakai after() seperti di ads
    after(async () => {
      console.log(`[DELETEAWESOME] done, ids=${ids.join(",")}`);
    });

    return true;
  });
