import type { ComponentProps } from "react";
import { findAd } from "@/server/web/ads/queries";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FaviconImage } from "@/components/ui/favicon";
import { BGPattern } from "../background/pattern-bg";

export async function AdCompact({ className, ...props }: ComponentProps<typeof Card>) {
  const ad = await findAd({ where: { type: "WidgetBanner" } });

  if (!ad) {
    return null;
  }

  return (
    <Card className={cx("relative isolate overflow-hidden z-30 rounded-lg border", "p-2 sm:p-1 sm:pl-4 sm:pr-12", "flex flex-col sm:flex-row items-start sm:items-center justify-between", "gap-2 sm:gap-3 md:gap-4", className)} {...props}>
      <div className="hidden sm:block">
        <BGPattern variant="diagonal-stripes" mask="fade-y" />
      </div>

      <div className="flex items-center gap-2 sm:gap-2 flex-1 min-w-0 w-full">
        <FaviconImage src={ad.faviconUrl} className="size-4 sm:size-8 lg:size-9 rounded-md border  sm:p-1 bg-white flex-shrink-0  sm:mt-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] sm:text-sm leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-1">{ad.description}</p>
        </div>
      </div>

      <div className="flex-shrink-0 w-full sm:w-auto">
        <Link href={ad.websiteUrl} target="_blank" className="block">
          <button type="button" className="w-full sm:w-auto whitespace-nowrap rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-sm transition-colors font-medium text-center">
            {ad.buttonLabel}
          </button>
        </Link>
      </div>
    </Card>
  );
}
