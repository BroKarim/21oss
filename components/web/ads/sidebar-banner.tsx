import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AdOne } from "@/server/web/ads/payloads";
import { Button } from "@/components/ui/button-shadcn";
import type { ComponentProps } from "react";

type SidebarAdsProps = ComponentProps<"div"> & {
  filter?: React.ReactNode;
  ad: AdOne | null;
};

export function SidebarAds({ className, filter, ad, ...props }: SidebarAdsProps) {
  if (!ad) {
    return null;
  }

  return (
    <div
      {...props}
      className={cn(
        "group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg bg-neutral-800 p-8 shadow-xl after:absolute after:top-0 after:left-0 after:size-full after:rounded-lg after:border-4 after:border-white/20",
        className
      )}
    >
      <div className="dither absolute top-0 left-0 z-10 size-full" />
      <div className="absolute top-0 right-0 bottom-0 left-0 z-5 bg-white opacity-25"></div>
      <div className="absolute top-2 left-3 z-15 w-[200px] text-left text-sm text-black">
        <h2 className="text-lg font-semibold">{ad.name}</h2>
        <p className="mb-2">{ad.description}</p>

        <Button asChild size="sm">
          <a href="https://pplx.ai/dzulkiram-hilmi" target="_blank" rel="noopener noreferrer">
            {ad.buttonLabel}
          </a>
        </Button>
      </div>

      <div className="absolute top-0 left-0 flex size-full scale-105 items-center">
        {filter}
        {ad.imageUrl && <Image src={ad.imageUrl} width={600} height={600} className={cn("scale-110", className)} alt="img" />}
      </div>
    </div>
  );
}

export const PixelFilter = () => {
  return (
    <svg width="0" height="0" className="absolute top-0 left-0">
      <defs>
        <filter id="pixelate" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur stdDeviation="0" in="SourceGraphic" result="smoothed" />
          <feImage width="10" height="10" xlinkHref="/pixel-grid.svg" result="displacement-map" />
          <feTile in="displacement-map" result="pixelate-map" />
          <feDisplacementMap in="smoothed" in2="pixelate-map" xChannelSelector="R" yChannelSelector="G" scale="5" result="pre-final">
            <animate attributeName="scale" values="2; 0; 2" dur="1s" repeatCount="indefinite" />
          </feDisplacementMap>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  );
};

export const RippleFilter = () => {
  return (
    <svg width="0" height="0" className="absolute top-0 left-0">
      <filter id="ripple" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="turbulence">
          <animate attributeName="baseFrequency" values="0.08; 0.1; 0.08" dur="4s" repeatCount="indefinite" />
        </feTurbulence>

        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
      </filter>
    </svg>
  );
};
