"use server";

import { revalidateTag } from "next/cache";
import { getToolRepositoryData } from "@/lib/repositories";

import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

export const fetchRepositoryData = adminProcedure.createServerAction().handler(async () => {
  const contents = await db.content.findMany({
    where: {
      repositoryUrl: { not: null },
    },
  });

  if (contents.length === 0) {
    return { success: false, message: "No tools found" };
  }

  await Promise.allSettled(
    contents.map(async (content) => {
      const result = await tryCatch(getToolRepositoryData(content.repositoryUrl));

      if (result.error) {
        console.error(`Failed to fetch repository data for ${content.name}`, {
          error: result.error,
          slug: content.slug,
        });

        return null;
      }

      if (!result.data) {
        return null;
      }

      await db.content.update({
        where: { id: content.id },
        data: result.data,
      });
    })
  );

  // Revalidate cache
  revalidateTag("showcase");
  revalidateTag("featured-showcase");
});
