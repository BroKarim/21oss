"use server";

import { ToolStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getToolRepositoryData } from "@/lib/repositories";
import { getAwesomeRepositoryData } from "@/lib/repositories";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { tryCatch } from "@/utils/helpers";

export const fetchRepositoryData = adminProcedure.createServerAction().handler(async () => {
  const tools = await db.tool.findMany({
    where: {
      status: { in: [ToolStatus.Published] },
    },
  });

  if (tools.length === 0) {
    return { success: false, message: "No tools found" };
  }

  await Promise.allSettled(
    tools.map(async (tool) => {
      const result = await tryCatch(getToolRepositoryData(tool.repositoryUrl));

      if (result.error) {
        console.error(`Failed to fetch repository data for ${tool.name}`, {
          error: result.error,
          slug: tool.slug,
        });

        return null;
      }

      if (!result.data) {
        return null;
      }

      await db.tool.update({
        where: { id: tool.id },
        data: result.data,
      });
    })
  );

  // Revalidate cache
  revalidateTag("showcase");
  revalidateTag("featured-showcase");
});

export const fetchAwesomeRepositoryData = adminProcedure.createServerAction().handler(async () => {
  const lists = await db.awesomeList.findMany();

  if (lists.length === 0) {
    return { success: false, message: "No awesome lists found" };
  }

  await Promise.allSettled(
    lists.map(async (list) => {
      const result = await tryCatch(getAwesomeRepositoryData(list.repositoryUrl));

      if (result.error) {
        console.error(`Failed to fetch repository data for ${list.name}`, {
          error: result.error,
          id: list.id,
        });
        return null;
      }

      if (!result.data) {
        return null;
      }

      await db.awesomeList.update({
        where: { id: list.id },
        data: result.data,
      });
    })
  );

  // Revalidate cache (kalau ada tag untuk awesome)
  revalidateTag("awesome-list");
});
