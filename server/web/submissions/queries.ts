// server/web/submission/queries.ts
"use server";

import { db } from "@/services/db";
import { SubmissionStatus } from "@prisma/client";

export const findPendingSubmissions = async () => {
  return db.toolSubmission.findMany({
    where: { status: SubmissionStatus.Pending },
    orderBy: { createdAt: "desc" },
  });
};
