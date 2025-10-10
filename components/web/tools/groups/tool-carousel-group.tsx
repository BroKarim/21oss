"use client";

import { useState, useRef } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { Button } from "@/components/ui/button-shadcn";
import { ChevronLeft, ChevronRight, Star, GitFork, Timer, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import ComponentPreviewImage from "../../card/card-image";
import { Insights } from "@/components/ui/insights";
import { ToolStacks } from "@/components/web/tools/tool-stacks";
import { Favicon } from "@/components/ui/favicon";
import { formatNumber } from "@primoui/utils";

type ToolCarouselGroupProps = {
  id: string;
  label: string;
  tools: ToolMany[];
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolCarouselGroup = ({ label, tools, options }: ToolCarouselGroupProps) => {
  const { showViewAll = false, viewAllUrl } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? tools.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tools.length - 1 ? 0 : prev + 1));
  };

  const handleSwipe = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrevious();
        }
      }
    };

    document.addEventListener("touchend", handleTouchEnd, { once: true });
  };

  const currentTool = tools[currentIndex];
  const primaryImage = currentTool.screenshots?.find((s) => s.order === 0)?.imageUrl;

  const lastCommitDate =
    currentTool.lastCommitDate &&
    formatDistanceToNowStrict(currentTool.lastCommitDate, {
      addSuffix: true,
    });

  const insights = [
    {
      label: "Stars",
      value: formatNumber(currentTool.stars, "standard"),
      icon: <Star />,
    },
    {
      label: "Forks",
      value: formatNumber(currentTool.forks, "standard"),
      icon: <GitFork />,
    },
    { label: "Last commit", value: lastCommitDate, icon: <Timer /> },
  ];

  return (
    <section className="w-full max-w-full space-y-4 rounded-lg border p-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{label}</h2>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col items-center gap-4">
        <div ref={containerRef} className="relative w-full h-[33vh] flex items-stretch gap-6 rounded-lg overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onTouchStart={handleSwipe}>
          {/* Image Section */}
          <div className="flex-shrink-0 w-1/2 relative group">
            <div className="relative w-full h-full rounded-lg shadow-base overflow-hidden">
              <div className="absolute inset-0">
                <ComponentPreviewImage src={primaryImage} alt={`${currentTool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center flex-col justify-center p-4">
                <p className="text-white text-sm text-center leading-relaxed mb-4">{currentTool.tagline}</p>
                <Insights insights={insights.filter((i) => i.value)} />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-4">
              <div className="flex items-start flex-col justify-between gap-3">
                <Favicon src={currentTool.faviconUrl} title={currentTool.name} className="size-8 p-1 rounded-md" />
                <h3 className="text-lg font-semibold truncate">{currentTool.name}</h3>
              </div>
              <div>
                <p className="text-sm text-foreground/80 line-clamp-3">{currentTool.description || currentTool.tagline}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/60 mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  <ToolStacks stacks={currentTool.stacks} />
                </div>
              </div>
            </div>

            {/* [PERUBAHAN]: Tombol Aksi */}
            <div className="flex items-center gap-2 mt-4">
              {currentTool.websiteUrl && (
                <Link href={currentTool.websiteUrl} rel="noopener noreferrer" className="truncate">
                  <Button variant="outline" size="sm">
                    Visit Website
                    <ExternalLink className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {currentTool.repositoryUrl && (
                <Link href={currentTool.repositoryUrl} rel="noopener noreferrer">
                  <Button variant="secondary" size="sm">
                    Repository
                    <Github className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          {isHovered && (
            <>
              <Button variant="ghost" size="icon" onClick={handlePrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {tools.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-foreground w-6" : "bg-foreground/30 w-2"}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="relative w-full space-y-3" onTouchStart={handleSwipe}>
          {/* Website URL */}
          {currentTool.websiteUrl && (
            <Link href={currentTool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block px-2">
              {currentTool.websiteUrl}
            </Link>
          )}

          {/* Image */}
          <div className="relative w-full aspect-video rounded-lg shadow-base overflow-hidden">
            <div className="absolute inset-0">
              <ComponentPreviewImage src={primaryImage} alt={`${currentTool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />
            </div>
          </div>

          {/* Pagination Indicator */}
          <div className="flex gap-2 justify-center">
            {tools.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-foreground w-6" : "bg-foreground/30 w-2"}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>

      {/* View All Link */}
      {showViewAll && viewAllUrl && (
        <div className="pt-2">
          <Link href={viewAllUrl} className="text-sm text-blue-500 hover:underline">
            View all →
          </Link>
        </div>
      )}
    </section>
  );
};
