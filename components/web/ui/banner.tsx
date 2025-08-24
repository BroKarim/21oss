"use client";

import React, { useState, memo } from "react";
import { AnimatedGridPattern } from "@/components/web/background/grid-pattern";
import TVNoise from "../background/tv-noise";
import { AdCompact } from "../ads/ad-compact-2";
const BannerContent = memo(function BannerContent() {
  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <AnimatedGridPattern />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 max-w-xs sm:max-w-2xl lg:max-w-4xl leading-tight">
          opensource
          <br />
          <span className="text-white">for the sake of daily life</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-sm sm:max-w-xl lg:max-w-2xl px-2">Tools, Resources & Products. Delivered weekly</p>
      </div>
    </section>
  );
});

const WidgetBanner = memo(function WidgetBanner() {
  const [show, setShow] = useState(true);

  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <TVNoise opacity={0.5} intensity={0.2} speed={40} />
      <div className="bg-accent/30 relative z-20 p-4 sm:px-6 h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] flex flex-col">
        <div className="flex justify-center items-center text-sm font-medium uppercase">
          <AdCompact
            show={show}
            onHide={() => setShow(false)}
            // icon={<LinkIcon className="m-px h-4 w-4 text-green-800" />}
            title={
              <>
                Claim a free <span className="font-semibold">.link</span> domain, free for 1 year.
              </>
            }
            action={{
              label: "Claim Domain",
              onClick: () => console.log("Claim domain clicked"),
            }}
            learnMoreUrl="https://dub.co/help/article/free-dot-link-domain"
          />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-display text-white" suppressHydrationWarning>
              open-source catalog designed to make discovering tools easier
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export const Banner = memo(function Banner({ variant = "widget" }: { variant?: "widget" | "content" }) {
  if (variant === "content") {
    return <BannerContent />;
  }
  return <WidgetBanner />;
});

export default Banner;
