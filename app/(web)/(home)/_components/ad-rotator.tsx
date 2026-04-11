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
      className="relative flex flex-row items-center gap-4 p-2 border rounded-xl bg-background w-[300px] min-h-[96px] max-w-full text-start cursor-pointer  transition-colors"
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
      <div className="absolute text-white  top-0 right-4 -translate-y-1/2 translate-x-1/3 py-0.5 px-2.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border border-zinc-700/80 rounded-full select-none z-10 shadow-sm">Ad</div>

      <div className="flex-shrink-0 flex items-start justify-center mt-1">
        {ad.faviconUrl ? (
          <img src={ad.faviconUrl} alt={ad.name} className="size-10 rounded-lg object-cover  shadow-inner" />
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

      // Increment index untuk ads berikutnya
      indexRef.current = (indexRef.current + 1) % adsRef.current.length;
    };

    // Trigger pertama kali
    showNextAd();

    const interval = setInterval(showNextAd, INTERVAL_DURATION);

    return () => {
      clearInterval(interval);
      toast.dismiss(TOAST_ID);
    };
  }, [ads.length]);

  return null;
}
