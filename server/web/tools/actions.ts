"use server";

import { findRecentTools, findResources, findStackFilters, countResources, groupPublishedTemplatesByTemplateType } from "@/server/web/tools/queries";
import { ResourcesParams } from "../shared/schema";

export async function getRecentTools() {
  return await findRecentTools({ take: 6 });
}

export async function getResources(searchParams: ResourcesParams) {
  return await findResources(searchParams);
}

export async function getResourcesCount(params: ResourcesParams) {
  return await countResources(params);
}

export async function getTemplateGroups() {
  return await groupPublishedTemplatesByTemplateType();
}

export async function loadMoreResources(searchParams: ResourcesParams, cursor: string) {
  return await findResources(searchParams, { cursor });
}

export async function getStackFilters() {
  return await findStackFilters();
}
