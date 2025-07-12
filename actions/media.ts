"use server";

import { z } from "zod";
import { uploadFavicon } from "@/lib/media";
import { adminProcedure } from "@/lib/safe-actions";

const mediaSchema = z.object({
  url: z.string().min(1).url(),
  path: z
    .string()
    .min(1)
    .regex(/^[a-z0-9/_-]+$/i),
});

export const generateFavicon = adminProcedure
  .createServerAction()
  .input(mediaSchema)
  .handler(async ({ input: { url, path } }) => uploadFavicon(url, path));
