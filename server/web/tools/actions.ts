"use server";

import { findRecentTools, filterToolsBySubcategory } from "@/server/web/tools/queries";

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

    // console.log("[SERVER ACTION] Query result count:", result?.length || 0);
    return result;
  } catch (error) {
    // console.error("[SERVER ACTION] Error in getToolsBySubcategory:", error);
    throw error;
  }
}
