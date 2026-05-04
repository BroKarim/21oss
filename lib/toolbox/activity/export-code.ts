import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { ACTIVITY_GRAPH_PALETTES, ACTIVITY_GRAPH_VARIANTS, type ActivityGraphPalette, type ActivityGraphVariant } from "@/lib/toolbox/activity/schema";

export type ActivityExportCodeFile = {
  name: string;
  code: string;
  language: "tsx";
};

export const activityExportCodeInputSchema = z.object({
  palette: z.enum(ACTIVITY_GRAPH_PALETTES),
  variant: z.enum(ACTIVITY_GRAPH_VARIANTS),
});

type GetActivityExportEntryCodeOptions = {
  palette: ActivityGraphPalette;
  variant: ActivityGraphVariant;
};

const CN_HELPER_SOURCE = `function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
`;

export function getActivityExportEntryCode({ palette, variant }: GetActivityExportEntryCodeOptions) {
  return `"use client";

import { GitHubActivityGraph, type ContributionDay } from "./graph";

type ActivityGraphPreviewProps = {
  data: ContributionDay[];
  totalContributions?: number;
};

export function ActivityGraphPreview({ data, totalContributions }: ActivityGraphPreviewProps) {
  return (
    <GitHubActivityGraph
      data={data}
      palette="${palette}"
      variant="${variant}"
      totalContributions={totalContributions}
    />
  );
}
`;
}

function normalizeGraphSource(source: string) {
  return source
    .replace(`from "@/components/web/toolbox/activity/template/by-chandai/contribution-graph";`, `from "./contribution-graph";`)
    .replace(`import type { ContributionDay } from "@/lib/toolbox/activity/get-activity-data";`, `export type ContributionDay = {\n  date: string;\n  count: number;\n};`)
    .replace(
      `import type { ActivityGraphPalette, ActivityGraphVariant } from "@/lib/toolbox/activity/schema";`,
      `type ActivityGraphPalette = "github" | "emerald" | "ocean" | "sunset";\ntype ActivityGraphVariant = "card" | "minimal" | "spotlight" | "chandai";`,
    )
    .replace(`import { cn } from "@/lib/utils";`, CN_HELPER_SOURCE.trim());
}

function normalizeContributionSource(source: string) {
  return source.replace(`import { cn } from "@/lib/utils";`, CN_HELPER_SOURCE.trim());
}

export async function getActivityExportFiles({ palette, variant }: GetActivityExportCodeOptions): Promise<ActivityExportCodeFile[]> {
  const graphPath = path.join(process.cwd(), "components/web/toolbox/activity/graph.tsx");
  const contributionGraphPath = path.join(process.cwd(), "components/web/toolbox/activity/template/by-chandai/contribution-graph.tsx");

  const [graphSource, contributionGraphSource] = await Promise.all([readFile(graphPath, "utf8"), readFile(contributionGraphPath, "utf8")]);

  const files: ActivityExportCodeFile[] = [
    {
      name: "main.tsx",
      code: getActivityExportEntryCode({ palette, variant }),
      language: "tsx",
    },
    {
      name: "graph.tsx",
      code: normalizeGraphSource(graphSource),
      language: "tsx",
    },
  ];

  if (variant === "chandai") {
    files.push({
      name: "contribution-graph.tsx",
      code: normalizeContributionSource(contributionGraphSource),
      language: "tsx",
    });
  }

  return files;
}

type GetActivityExportCodeOptions = z.infer<typeof activityExportCodeInputSchema>;
