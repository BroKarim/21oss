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

    const existing = await db.stack.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
    if (existing) return existing;

    const stack = await db.stack.create({
      data: { name: normalized.name, slug },
      select: { id: true, name: true, slug: true },
    });

    revalidateTag("stacks");

    return stack;
  });
