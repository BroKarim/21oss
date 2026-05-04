import { z } from "zod";
import { parseGitHubUrl } from "./parse-github-url";

export const ACTIVITY_GRAPH_PALETTES = ["github", "emerald", "ocean", "sunset"] as const;
export const ACTIVITY_GRAPH_VARIANTS = ["card", "minimal", "spotlight", "chandai"] as const;

const githubUrlMessage = "Please enter a valid GitHub profile or repository URL";
const githubProfileUrlMessage = "Please enter a valid GitHub profile URL";
const githubRepoUrlMessage = "Please enter a valid GitHub repository URL";

export const activityGraphPaletteSchema = z.enum(ACTIVITY_GRAPH_PALETTES);
export const activityGraphVariantSchema = z.enum(ACTIVITY_GRAPH_VARIANTS);

export const githubActivityUrlSchema = z
  .string()
  .min(1, "GitHub URL is required")
  .trim()
  .refine((value) => parseGitHubUrl(value) !== null, githubUrlMessage);

export const githubProfileUrlSchema = z
  .string()
  .min(1, "GitHub profile URL is required")
  .trim()
  .refine((value) => parseGitHubUrl(value)?.type === "profile", githubProfileUrlMessage);

export const githubRepoUrlSchema = z
  .string()
  .min(1, "GitHub repository URL is required")
  .trim()
  .refine((value) => parseGitHubUrl(value)?.type === "repo", githubRepoUrlMessage);

export const activityGraphInputSchema = z.object({
  url: githubActivityUrlSchema,
  palette: activityGraphPaletteSchema.default("github"),
  variant: activityGraphVariantSchema.default("card"),
});

export type ActivityGraphPalette = z.infer<typeof activityGraphPaletteSchema>;
export type ActivityGraphVariant = z.infer<typeof activityGraphVariantSchema>;
export type ActivityGraphInput = z.infer<typeof activityGraphInputSchema>;
