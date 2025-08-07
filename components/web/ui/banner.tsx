"use client";

import { memo } from "react";
import { AnimatedGridPattern } from "../background/grid-pattern";

//from 21
const BoltBannerContent = memo(function BoltBannerContent() {
  return (
    <section className="relative min-h-[200px] border  rounded-md overflow-hidden bg-black">
      <AnimatedGridPattern />
      {/* Floating Elements */}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px] px-8 text-center">
        <h1 className="text-6xl font-bold mb-6 max-w-4xl">
          All the Tools You Need
          <br />
          <span className="text-white">in one place.</span>
        </h1>

        <p className="text-xl text-gray-300 mb-8 max-w-2xl">Tools, Resources & Products. Delivered weekly</p>
      </div>
    </section>
  );
});

export function BoltBanner() {
  return <BoltBannerContent />;
}
