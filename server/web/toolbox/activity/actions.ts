"use server";

import { createServerActionProcedure } from "zsa";
import { activityExportCodeInputSchema, getActivityExportFiles } from "@/lib/toolbox/activity/export-code";

const publicProcedure = createServerActionProcedure().handler(async () => ({}));

export const loadActivityExportCode = publicProcedure
  .createServerAction()
  .input(activityExportCodeInputSchema)
  .handler(async ({ input }) => {
    return await getActivityExportFiles(input);
  });
