import type { AdType } from "@prisma/client";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { findAd } from "@/server/web/ads/queries";
import { adOnePayload } from "@/server/web/ads/payloads";
import { Prisma } from "@prisma/client";

type Ad = Prisma.AdGetPayload<{ select: typeof adOnePayload }>;

interface BannerContentProps {
  ad?: Ad;
  type: AdType;
}
const AdBanner = async ({ type }: BannerContentProps) => {
  const ad = await findAd({ where: { type } });

  if (!ad) return null;
  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black snap-center flex-shrink-0 w-full">
      <div className="flex items-center justify-between gap-8 p-4 sm:p-6 lg:p-8">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {ad?.description || ad?.name}
              <span className="text-blue-600"> {ad?.name}</span>
            </h1>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium" size="lg" asChild>
            <a href={ad?.websiteUrl} target="_blank" rel="noopener noreferrer">
              {ad?.buttonLabel || `Visit ${ad?.name}`}
            </a>
          </Button>
        </div>
        {ad?.imageUrl && (
          <div className="flex-shrink-0">
            <Image src={ad.imageUrl} alt={ad.name} width={400} height={200} className="rounded-lg shadow-sm" />
          </div>
        )}
      </div>
    </section>
  );
};

export { AdBanner };
