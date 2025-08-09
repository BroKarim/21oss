import { memo } from "react";

import { AnimatedGridPattern } from "@/components/web/background/grid-pattern";

const BoltBannerContent = memo(function BoltBannerContent() {
  return (
    <section className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] border rounded-md overflow-hidden bg-black">
      <AnimatedGridPattern />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 max-w-xs sm:max-w-2xl lg:max-w-4xl leading-tight">
          All the Tools You Need
          <br />
          <span className="text-white">in one place.</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-sm sm:max-w-xl lg:max-w-2xl px-2">Tools, Resources & Products. Delivered weekly</p>
      </div>
    </section>
  );
});

export const BoltBanner = memo(function BoltBanner() {
  return <BoltBannerContent />;
});

export default BoltBanner;
