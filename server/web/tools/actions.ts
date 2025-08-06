"use server";

import { findFeaturedTool, findToolsWithCategories, findRecentTools } from "@/server/web/tools/queries";
// import { getSubcategories } from "../categories/queries";
export async function getRecentTools() {
  return await findRecentTools({ take: 6 });
}

export async function getFeaturedTools() {
  return await findFeaturedTool({ take: 8 });
}

export async function getDesignTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "design" } } },
  });
}

export async function getDevelopmentTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "development" } } },
  });
}

export async function getAiTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "ai" } } },
  });
}

export async function getProductivityTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "productivity" } } },
  });
}

export async function getToolsBySubcategory(slug: string) {
  return await findToolsWithCategories({
    where: {
      categories: {
        some: { slug },
      },
    },
    orderBy: { publishedAt: "desc" },
  });
}
// Add more as needed based on your homeSections
