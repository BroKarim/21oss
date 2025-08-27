import type { ComponentProps } from "react";
import { findAd } from "@/server/web/ads/queries";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FaviconImage } from "@/components/ui/favicon";
export async function AdCompact({ className, ...props }: ComponentProps<typeof Card>) {
  const ad = await findAd({ where: { type: "ToolPage" } });

  if (!ad) {
    return null;
  }

  return (
    <Card
      className={cx(
        "relative isolate flex flex-col justify-between gap-3 overflow-hidden z-30    rounded-lg border border-green-600/15 bg-gradient-to-r from-lime-100/80 to-emerald-100/80 py-1 pl-4 pr-12 sm:flex-row sm:items-center ",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <FaviconImage src={ad.faviconUrl} className="size-10 sm:size-9 rounded-md border border-green-700/50 p-1 bg-white" />
        <p className="text-sm text-gray-900">{ad.description}</p>
      </div>

      <Link href={ad.websiteUrl} target="_blank" className="flex items-center sm:-my-1">
        <button type="button" className="whitespace-nowrap rounded-md border border-green-700/50 px-3 py-1 text-sm text-gray-800 transition-colors hover:bg-green-500/10">
          {ad.buttonLabel}
        </button>
      </Link>
    </Card>
  );
}
