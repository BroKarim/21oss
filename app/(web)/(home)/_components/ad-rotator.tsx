"use client";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/server/web/analytics/actions";
type AdProp = {
  id: string;
  name: string;
  description: string | null;
  websiteUrl: string;
  affiliateUrl: string | null;
  buttonLabel: string | null;
  faviconUrl: string | null;
};
const TOAST_ID = "ad-rotator-toast";
const VISIBLE_DURATION = 8000;
const INTERVAL_DURATION = 8500;
const AdToastCard = ({ ad }: { ad: AdProp }) => {
  return (
    <div
      className="relative flex w-[300px] max-w-full min-h-[96px] cursor-pointer items-center gap-4 rounded-xl border bg-background p-2 text-start transition-colors"
      onClick={() => {
        void trackEvent({
          type: "AD_CLICK",
          url: window.location.pathname,
          adId: ad.id,
          country: undefined,
        });
        const targetUrl = ad.affiliateUrl || ad.websiteUrl;
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        toast.dismiss(TOAST_ID);
      }}
    >
      <div className="absolute top-0 right-4 z-10 -translate-y-1/2 translate-x-1/3 select-none rounded-full border border-zinc-700/80 bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">Ad</div>
      <div className="mt-1 flex shrink-0 items-start justify-center">
        {ad.faviconUrl ? (
          <img src={ad.faviconUrl} alt={ad.name} className="size-10 rounded-lg object-cover shadow-inner" />
        ) : (
          <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <span className="text-zinc-500 font-bold">{ad.name[0]}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h4 className="font-bold text-sm leading-tight truncate">{ad.name}</h4>
        {ad.description && <p className="text-xs leading-relaxed line-clamp-3 font-normal text-muted-foreground">{ad.description}</p>}
      </div>
    </div>
  );
};
export function AdRotator({ ads }: { ads: AdProp[] }) {
  const adsRef = useRef(ads);
  const indexRef = useRef(0);
  useEffect(() => {
    adsRef.current = ads;
  }, [ads]);
  useEffect(() => {
    if (ads.length === 0) return;
    const showNextAd = () => {
      const ad = adsRef.current[indexRef.current];
      if (!ad) return;
      toast.custom(() => <AdToastCard ad={ad} />, {
        id: TOAST_ID,
        duration: VISIBLE_DURATION,
        position: "bottom-right",
      });
      indexRef.current = (indexRef.current + 1) % adsRef.current.length;
    };
    showNextAd();
    const interval = setInterval(showNextAd, INTERVAL_DURATION);
    return () => {
      clearInterval(interval);
      toast.dismiss(TOAST_ID);
    };
  }, [ads.length]);
  return null;
}
