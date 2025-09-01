import type { ComponentProps } from "react";
import { findAd } from "@/server/web/ads/queries";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FaviconImage } from "@/components/ui/favicon";
import { BGPattern } from "../background/pattern-bg";
export async function AdCompact({ className, ...props }: ComponentProps<typeof Card>) {
  const ad = await findAd({ where: { type: "ToolPage" } });

  if (!ad) {
    return null;
  }

  return (
    <Card className={cx("relative isolate overflow-hidden z-30 rounded-lg border ", "sm:p-1 sm:pl-4 sm:pr-12", "flex flex-row items-center justify-between", "gap-2 sm:gap-3 md:gap-4", className)} {...props}>
      <BGPattern variant="diagonal-stripes" mask="fade-y" />
      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
        <FaviconImage src={ad.faviconUrl} className="size-5 sm:size-8 lg:size-9 rounded-md border  p-0.5 sm:p-1 bg-white flex-shrink-0" />
        <p className="text-[10px] sm:text-sm  leading-tight sm:leading-snug line-clamp-1">{ad.description}</p>
      </div>

      {/* Right side - CTA Button */}
      <div className="flex-shrink-0">
        <Link href={ad.websiteUrl} target="_blank" className="block">
          <button type="button" className="whitespace-nowrap rounded-md border  px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[10px] sm:text-sm  transition-colors  font-medium">
            {ad.buttonLabel}
          </button>
        </Link>
      </div>
    </Card>
  );
}
