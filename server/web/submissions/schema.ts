// server/web/submission/schema.ts
import { z } from "zod";

export const toolSubmissionSchema = z.object({
  websiteUrl: z.string().url(),
  githubUrl: z.string().url(),
});

export type ToolSubmissionSchema = z.infer<typeof toolSubmissionSchema>;
