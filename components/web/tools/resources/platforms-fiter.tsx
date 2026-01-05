"use client";

import * as React from "react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

type PlatformItem = {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
};

interface PlatformFilterProps {
  platforms: PlatformItem[];
}

//g usah pake FEATURED_PLATFORM, 
// apus saja data yg g kepake di TABLE PLATFORM 
export function PlatformFilter({ platforms }: PlatformFilterProps) {
  const [activePlatform, setActivePlatform] = useQueryState("platform", {
    shallow: false,
  });

  const handleSelect = (slug: string) => {
    if (activePlatform === slug) {
      setActivePlatform(null);
    } else {
      setActivePlatform(slug);
    }
  };

  return (
    <div className="relative group w-full">
      {/* Fade kiri */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      {/* Fade kanan */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {platforms.map((platform) => {
          const isActive = activePlatform === platform.slug;

          return (
            <button
              key={platform.id}
              onClick={() => handleSelect(platform.slug)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-all whitespace-nowrap",
                isActive ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-foreground border-input hover:bg-muted hover:border-foreground/50"
              )}
            >
              {platform.iconUrl && (
                <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 bg-white/10">
                  <Image src={platform.iconUrl} alt={platform.name} fill className="object-contain" />
                </div>
              )}
              <span>{platform.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
