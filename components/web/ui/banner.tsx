"use client";

import React, { useState, useEffect, memo } from "react";
import { AnimatedGridPattern } from "@/components/web/background/grid-pattern";
import TVNoise from "../background/tv-noise";

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });
  };

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

  const widgetData = {
    temperature: "24°C",
    location: "Medan, ID",
    timezone: "WIB",
  };

  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <TVNoise opacity={1} intensity={0.2} speed={40} />
      <div className="bg-accent/30 flex-1 flex flex-col justify-between text-sm font-medium uppercase relative z-20 p-4 sm:p-6 lg:p-8 h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
        <div className="flex justify-between items-center">
          <span className="opacity-50 text-white">{dateInfo.dayOfWeek}</span>
          <span className="text-white">{dateInfo.restOfDate}</span>
        </div>

        <div className="text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-display text-white" suppressHydrationWarning>
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="opacity-50 text-white">{widgetData.temperature}</span>
          <span className="text-white">{widgetData.location}</span>
          <div className="bg-accent px-2 py-1 rounded text-xs">{widgetData.timezone}</div>
        </div>

        <div className="absolute inset-0 -z-[1] opacity-20">
          <div className="size-full bg-[url('/assets/pc_blueprint.gif')] bg-contain bg-center bg-no-repeat" />
        </div>
      </div>
    </section>
  );
});

export const Banner = memo(function Banner() {
  return <WidgetBanner />;
});

export default Banner;
