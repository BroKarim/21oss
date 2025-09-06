import { z } from "zod";

import { AwesomeCategory } from "@prisma/client";

export const awesomeFilterSchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(12),
  sort: z.string().optional().default("stars.desc"),
  category: z.nativeEnum(AwesomeCategory).array().optional().default([]),
});

export type AwesomeFilterSchema = z.infer<typeof awesomeFilterSchema>;
