"use server";

import { findRecentTools, filterToolsBySubcategory, findResources } from "@/server/web/tools/queries";

export async function getRecentTools() {
  return await findRecentTools({ take: 6 });
}

export async function getToolsBySubcategory(
  subcategorySlug: string,
  filters?: {
    q?: string;
    stack?: string[];
    license?: string[];
    platform?: string[];
  }
) {
  try {
    const result = await filterToolsBySubcategory({
      subcategory: subcategorySlug,
      q: filters?.q,
      stack: filters?.stack,
      license: filters?.license,
      platform: filters?.platform,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getResources({
  orderBy = "stars",
  take = 12,
  where,
}: {
  orderBy?: "stars" | "latest";
  take?: number;
  where?: import("@prisma/client").Prisma.ToolWhereInput;
} = {}) {
  return await findResources({
    orderBy,
    take,
    where,
  });
}
