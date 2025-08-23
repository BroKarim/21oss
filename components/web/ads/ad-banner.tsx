import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { findAd } from "@/server/web/ads/queries";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cx } from "@/lib/utils";

const AdBanner = async ({ className, ...props }: ComponentProps<typeof Card>) => {
  const ad = await findAd({ where: { type: "Banner" } });

  if (!ad) {
    return null;
  }

  return (
    <Card className={cx("relative overflow-hidden bg-gradient-to-r from-gray-100 to-[#826ce8] p-8 rounded-2xl shadow-lg", className)} {...props}>
      <div className="flex items-center justify-between gap-8">
        {/* Left side content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{ad.description}</h1>
          </div>

          <Link href={ad.websiteUrl} passHref>
            <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium mt-4" size="lg">
              {ad.buttonLabel}
            </Button>
          </Link>
        </div>

        {/* Right side - Hi Alex message as image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image src="https://singapore-openlayout.s3.ap-southeast-1.amazonaws.com/ads/hostinger-ad.png" alt="Hi Alex message" width={400} height={200} className="rounded-lg shadow-sm" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export { AdBanner };
