"use client";

import React, { useState, useEffect, memo } from "react";
import { AnimatedGridPattern } from "@/components/web/background/grid-pattern";
import TVNoise from "../background/tv-noise";
import { AdCompact } from "../ads/ad-compact";
const BannerContent = memo(function BannerContent() {
  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <AnimatedGridPattern />

      {/* Main Content */}
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const restOfDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { dayOfWeek, restOfDate };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <TVNoise opacity={0.5} intensity={0.2} speed={40} />
      <div className="bg-accent/30 relative z-20 p-4 sm:p-6 h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] flex flex-col">
        {/* DateInfo - Always at top */}
        <div className="flex opacity-50 justify-between items-center text-sm font-medium uppercase">
          <span className=" text-white">{dateInfo.dayOfWeek}</span>
          {/* <AdCompact className="w-full"/> */}
          <span className="text-white">{dateInfo.restOfDate}</span>
        </div>

        {/* Content - Centered vertically in remaining space */}
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
