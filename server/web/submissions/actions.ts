"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/services/db";
import { createServerActionProcedure } from "zsa";
import { toolSubmissionSchema } from "./schema";

const publicProcedure = createServerActionProcedure()
  .input(toolSubmissionSchema)
  .handler(async ({ input }) => {
    return input;
  });
export const submitTool = publicProcedure
  .createServerAction()
  .input(toolSubmissionSchema)
  .handler(async ({ input }) => {
    try {
      const submission = await db.toolSubmission.create({
        data: {
          websiteUrl: input.websiteUrl,
          githubUrl: input.githubUrl,
        },
      });

      revalidateTag("tool-submissions");
      return submission;
    } catch (error) {
      throw error;
    }
  });
