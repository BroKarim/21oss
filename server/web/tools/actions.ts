"use server";

import { searchTemplates } from "@/lib/meilisearch/search";
import { findResources, findStackFilters, countResources } from "@/server/web/tools/queries";
import { ResourcesParams } from "../shared/schema";
import { buildTemplateSearchParams } from "./search";

export async function getResources(searchParams: ResourcesParams) {
  return await findResources(searchParams);
}

export async function getResourcesCount(params: ResourcesParams) {
  return await countResources(params);
}

export async function loadMoreResources(searchParams: ResourcesParams, cursor: string) {
  return await findResources(searchParams, { cursor });
}

export async function loadMoreTemplateSearchResources(searchParams: ResourcesParams, page: number) {
  return await searchTemplates(buildTemplateSearchParams(searchParams, page));
}

export async function getStackFilters() {
  return await findStackFilters();
}
