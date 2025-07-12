import type { Tool } from "@prisma/client";

/**
 * Check if a tool is published.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return ["Published"].includes(tool.status);
};
