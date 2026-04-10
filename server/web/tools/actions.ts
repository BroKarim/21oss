"use server";

import { findRecentTools, filterToolsBySubcategory, findResources, findStackFilters, findPlatformFilters, countResources } from "@/server/web/tools/queries";
import { ResourcesParams } from "../shared/schema";

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

export async function getResources(searchParams: ResourcesParams) {
  return await findResources(searchParams);
}

export async function getResourcesCount(type: Parameters<typeof countResources>[0]) {
  return await countResources(type);
}

export async function loadMoreResources(searchParams: ResourcesParams, cursor: string) {
  return await findResources(searchParams, { cursor });
}

export async function getStackFilters() {
  return await findStackFilters();
}
// server/web/tools/actions.ts
export async function getPlatformFilters() {
  return await findPlatformFilters();
}
