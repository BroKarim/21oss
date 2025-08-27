"use server";

import { findToolsWithCategories, findRecentTools } from "@/server/web/tools/queries";
export async function getRecentTools() {
  return await findRecentTools({ take: 6 });
}

export async function getDesignTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "colors" } } },
  });
}

export async function getDevelopmentTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "dev-tools" } } },
  });
}
export async function getApiTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "apis-and-integration" } } },
  });
}
export async function getLlmTools() {
  return await findToolsWithCategories({
    where: { categories: { some: { slug: "llm-ecosystem" } } },
  });
}

export async function getUtilityTools() {
  return await findToolsWithCategories({
    where: {
      categories: {
        some: { slug: "utility-and-software" },
      },
    },
  });
}
export async function getUIUXTools() {
  return await findToolsWithCategories({
    where: {
      categories: {
        some: { slug: "ui-ux" },
      },
    },
  });
}

export async function getAiTools() {
  return await findToolsWithCategories({
    where: {
      categories: {
        some: {
          OR: [{ slug: "ai" }, { parent: { slug: "ai" } }],
        },
      },
    },
    take: 9,
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
