"use server";

import { findResources, findStackFilters, countResources } from "@/server/web/tools/queries";
import { ResourcesParams } from "../shared/schema";

export async function getResources(searchParams: ResourcesParams) {
  return await findResources(searchParams);
}

export async function getResourcesCount(params: ResourcesParams) {
  return await countResources(params);
}

export async function loadMoreResources(searchParams: ResourcesParams, cursor: string) {
  return await findResources(searchParams, { cursor });
}

export async function getStackFilters() {
  return await findStackFilters();
}
