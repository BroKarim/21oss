"use client";

import { memo } from "react";
import { AnimatedGridPattern } from "./background/grid-pattern";

const floatingElements = [
  { label: "Video", count: "67+", position: "top-20 left-20", color: "bg-blue-600" },
  { label: "Libraries", count: "269+", position: "top-32 left-40", color: "bg-blue-700" },
  { label: "Startup", count: "81+", position: "top-40 right-80", color: "bg-blue-500" },
  { label: "Design", count: "244+", position: "top-60 left-32", color: "bg-blue-600" },
  { label: "Marketing", count: "104+", position: "top-16 right-40", color: "bg-blue-700" },
  { label: "AI", count: "115+", position: "top-48 right-20", color: "bg-blue-500" },
  { label: "Coding", count: "76+", position: "bottom-20 right-32", color: "bg-blue-600" },
];
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
