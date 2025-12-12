"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "@/lib/safe-actions";
import { db } from "@/services/db";
import { uploadToS3Storage } from "@/lib/media";
import { resourceSchema } from "./schema";
import { slugify, getRandomString } from "@primoui/utils";
import { revalidateTag } from "next/cache";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VALID_VIDEO_TYPES = ["video/mp4", "video/webm"];
function validateFileNotEmpty(file: File) {
  return file.size > 0;
}

function validateFileType(file: File) {
  return [...VALID_IMAGE_TYPES, ...VALID_VIDEO_TYPES].includes(file.type);
}

function validateFileSize(file: File) {
  return file.size <= MAX_FILE_SIZE;
}

export const uploadResourceMedia = adminProcedure
  .createServerAction()
  .input(
    z.object({
      resourceName: z.string().min(1, "Resource name is required"),
      file: z.instanceof(File).refine(validateFileNotEmpty, "File cannot be empty").refine(validateFileType, "Only JPG, PNG, WEBP, MP4, or WEBM allowed").refine(validateFileSize, "File size must be less than 20MB"),
    })
  )
  .handler(async ({ input: { resourceName, file } }) => {
    const isVideo = VALID_VIDEO_TYPES.includes(file.type as any);

    const buffer = Buffer.from(await file.arrayBuffer());

    const extension = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const randomKey = getRandomString();
    const key = `resources/${slugify(resourceName)}/${randomKey}.${extension}`;

    const fileUrl = await uploadToS3Storage(buffer, key);

    return {
      url: fileUrl,
      type: isVideo ? "video" : "image",
    };
  });

export const upsertResource = adminProcedure
  .createServerAction()
  .input(resourceSchema)
  .handler(async ({ input }) => {
    const { id, ...data } = input;

    const slug = data.slug || slugify(data.name);

    const cleanMedia = data.media.filter((url) => url.trim() !== "");

    let resource;

    if (id) {
      resource = await db.resource.update({
        where: { id },
        data: {
          ...data,
          slug,
          media: cleanMedia,
        },
      });
    } else {
      resource = await db.resource.create({
        data: {
          ...data,
          slug,
          media: cleanMedia,
        },
      });
    }

    revalidateTag("resources");
    revalidateTag(`resource-${resource.slug}`);

    return resource;
  });

export const deleteResources = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input }) => {
    const { ids } = input;

    await db.resource.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/resources");
    return { success: true };
  });
