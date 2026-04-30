import { z } from "zod";

export const stackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  type: z.enum(["Language", "Framework", "Library", "Tool", "SaaS", "Cloud", "ETL", "Analytics", "DB", "Hosting", "API", "Storage", "Monitoring", "Messaging", "App", "Network"]).default("Language"),
  description: z.string().optional(),
  website: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
});

export type StackSchema = z.infer<typeof stackSchema>;
