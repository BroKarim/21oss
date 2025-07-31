"use server";

import { slugify } from "@primoui/utils";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { stackSchema } from "./schema";
import { db } from "@/services/db";

// Create stack (tanpa update)
export const createStack = adminProcedure
  .createServerAction()
  .input(
    stackSchema
      .extend({ id: z.string().optional() }) // opsional agar bisa reuse
      .pick({ name: true }) // hanya input "name"
  )
  .handler(async ({ input: { name } }) => {
    const slug = slugify(name);

    const existing = await db.stack.findUnique({ where: { slug } });
    if (existing) return existing;

    const stack = await db.stack.create({
      data: { name, slug },
    });

    revalidateTag("stacks");

    return stack;
  });

export const deleteStack = adminProcedure
  .createServerAction()
  .input(
    z.object({
      slug: z.string().min(1, "Slug is required"),
    })
  )
  .handler(async ({ input: { slug } }) => {
    const stack = await db.stack.findUnique({ where: { slug } });
    if (!stack) {
      throw new Error(`Stack with slug "${slug}" not found`);
    }

    await db.stack.delete({ where: { slug } });

    revalidateTag("stacks");

    return { success: true, message: `Stack "${stack.name}" deleted successfully` };
  });
