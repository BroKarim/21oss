import { z } from "zod";

export const stackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
});

export type StackSchema = z.infer<typeof stackSchema>;
