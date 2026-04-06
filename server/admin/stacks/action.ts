"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { stackSchema } from "./schema";
import { db } from "@/services/db";
import { normalizeStackInput } from "@/lib/stack-utils";

export const createStack = adminProcedure
  .createServerAction()
  .input(stackSchema.extend({ id: z.string().optional() }).pick({ name: true }))
  .handler(async ({ input: { name } }) => {
    const normalized = normalizeStackInput(name);
    const slug = normalized.slug;

    const existing = await db.stack.findUnique({ where: { slug } });
    if (existing) return existing;

    const stack = await db.stack.create({
      data: { name: normalized.name, slug },
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
