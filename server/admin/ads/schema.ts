// schema.ts

import { type Ad, AdType } from "@prisma/client";
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";
import { getSortingStateParser } from "@/lib/parsers";

export const adsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  sort: getSortingStateParser<Ad>().withDefault([{ id: "createdAt", desc: true }]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  type: parseAsArrayOf(z.nativeEnum(AdType)).withDefault([]),
};

export const adsTableParamsCache = createSearchParamsCache(adsTableParamsSchema);

export type AdsTableSchema = Awaited<ReturnType<typeof adsTableParamsCache.parse>>;

export const adSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().or(z.literal("")),
    websiteUrl: z.string().min(1, "Website is required").url(),
    affiliateUrl: z.string().url().optional().or(z.literal("")),
    imageUrl: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
    buttonLabel: z.string().optional().or(z.literal("")),
    faviconUrl: z.string().url("Favicon must be a valid URL").optional().or(z.literal("")),
    type: z.nativeEnum(AdType).default(AdType.All),
    startsAt: z.string().date().optional(),
    endsAt: z.string().date().optional(),
    subscriptionId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.endsAt) >= new Date(data.startsAt);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endsAt"],
    }
  );

export type AdsSchema = z.infer<typeof adSchema>;
