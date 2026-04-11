"use client";
import { trackEvent } from "@/server/web/analytics/actions";
type AdCardProps = {
  ad: {
    id: string;
    name: string;
    description: string | null;
    affiliateUrl: string | null;
    websiteUrl: string;
    buttonLabel: string | null;
    faviconUrl: string | null;
  };
};
export function AdCard({ ad }: AdCardProps) {
  const targetUrl = ad.affiliateUrl || ad.websiteUrl;
  const handleClick = () => {
    void trackEvent({
      type: "AD_CLICK",
      url: window.location.pathname,
      adId: ad.id,
      country: undefined,
    });
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <div
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group relative cursor-pointer w-full space-y-2"
    >
      {}
      <div className="relative w-full aspect-video overflow-hidden shadow-base rounded-lg border bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center gap-3 p-6 transition-colors group-hover:border-zinc-600">
        {}
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5 select-none">Ad</span>
        {}
        {ad.faviconUrl ? (
          <img src={ad.faviconUrl} alt={ad.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shadow-md" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center border border-zinc-600">
            <span className="text-xl font-bold text-zinc-300">{ad.name[0]}</span>
          </div>
        )}
        {}
        {ad.description && <p className="text-xs text-zinc-400 text-center line-clamp-3 leading-relaxed max-w-[220px]">{ad.description}</p>}
        {}
        {ad.buttonLabel && <span className="mt-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10 px-4 py-1.5 text-xs font-medium text-white">{ad.buttonLabel}</span>}
      </div>
      {}
      <div className="flex items-center space-x-2">
        {ad.faviconUrl && <img src={ad.faviconUrl} alt={ad.name} className="w-6 h-6 rounded flex-shrink-0" loading="lazy" />}
        <div className="flex-1 flex flex-col min-w-0">
          <p className="text-base font-medium text-foreground truncate">{ad.name}</p>
          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-1">Sponsored · {new URL(ad.websiteUrl).hostname.replace("www.", "")}</p>
        </div>
      </div>
    </div>
  );
}
