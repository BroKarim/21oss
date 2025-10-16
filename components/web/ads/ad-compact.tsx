import type { ComponentProps } from "react";
import { findAd } from "@/server/web/ads/queries";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FaviconImage } from "@/components/ui/favicon";
import { BGPattern } from "../background/pattern-bg";

export async function AdCompact({ className, ...props }: ComponentProps<typeof Card>) {
  const ad = await findAd({ where: { type: "WidgetBanner" } });
  if (!ad) return null;

  return (
    <Card className={cx("relative isolate overflow-hidden z-30 rounded-lg border", "p-0 sm:p-1 sm:pl-4 sm:pr-12", "flex flex-col sm:flex-row items-start sm:items-center justify-between", "gap-0 sm:gap-3 md:gap-4", className)} {...props}>
      {/* background */}
      <div className="hidden sm:block">
        <BGPattern variant="diagonal-stripes" mask="fade-y" />
      </div>

      {/* left section */}
      <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-0">
        <FaviconImage src={ad.faviconUrl} className="hidden sm:flex size-5 sm:size-8 lg:size-9 rounded-md border sm:p-1 bg-white flex-shrink-0" />

        {/* description (only desktop) */}
        <p className="hidden sm:block text-xs sm:text-sm leading-snug line-clamp-1 flex-1 min-w-0">{ad.description}</p>
      </div>

      {/* right section */}
      <div className="flex-shrink-0 w-full sm:w-auto">
        <Link href={ad.websiteUrl} target="_blank" className="block">
          <button type="button" className="w-full flex items-center justify-center sm:justify-between gap-2 rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-sm font-medium transition-colors text-center">
            {/* favicon (only mobile) */}
            <FaviconImage src={ad.faviconUrl} className="flex sm:hidden size-4 rounded-md border bg-white" />
            {ad.buttonLabel}
          </button>
        </Link>
      </div>
    </Card>
  );
}
