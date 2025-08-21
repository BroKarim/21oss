import type { AdType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { findAd } from "@/server/web/ads/queries";
import { adOnePayload } from "@/server/web/ads/payloads";
import { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
type Ad = Prisma.AdGetPayload<{ select: typeof adOnePayload }>;

interface BannerContentProps {
  ad?: Ad;
  type: AdType;
}

const AdBanner = async ({ type }: BannerContentProps) => {
  const ad = await findAd({ where: { type } });

  // fallback data
  const fallbackAd: Ad = {
    name: "Slashit",
    description: "Turn repetitive text into shortcuts using",
    buttonLabel: "Download, It's free",
    websiteUrl: "#",
    imageUrl: "https://singapore-openlayout.s3.ap-southeast-1.amazonaws.com/ads/hostinger-ads.png",
    type,
    faviconUrl: "https://singapore-openlayout.s3.ap-southeast-1.amazonaws.com/ads/hostinger-favicon.png",
  };

  const data = ad || fallbackAd;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-gray-100 to-yellow-100 p-8 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-8">
        {/* Left side content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Turn repetitive text into shortcuts, <span className="text-blue-600">write 10x faster</span> using Slashit.
            </h1>
          </div>

          <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium" size="lg">
            Download, It's free
          </Button>
        </div>

        {/* Right side - Hi Alex message as image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image src="https://singapore-openlayout.s3.ap-southeast-1.amazonaws.com/ads/hostinger-ads.png" alt="Hi Alex message" width={400} height={200} className="rounded-lg shadow-sm" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export { AdBanner };
