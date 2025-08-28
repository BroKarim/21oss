import TVNoise from "../background/tv-noise";
import { AdCompact } from "../ads/ad-compact";

export default function WidgetBanner() {
  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <TVNoise opacity={0.5} intensity={0.2} speed={40} />
      <div className="bg-accent/30 relative z-20 p-3 sm:p-6 h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] flex flex-col">
        {/* Top */}
        <div className="flex justify-center items-center text-xs sm:text-sm font-medium uppercase ">
          <AdCompact />
        </div>

        {/* Center text */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-2 sm:px-4">
            <div className="text-xl sm:text-3xl lg:text-5xl font-display text-white leading-snug text-balance break-words" suppressHydrationWarning>
              open-source catalog designed to make discovering tools easier
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
