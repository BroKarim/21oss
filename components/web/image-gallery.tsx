"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  items: string[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
}

// Constants
const SUPPORTED_VIDEO_FORMATS = /\.(mp4|webm|ogg|mov)$/i;
const SUPPORTED_GIF_FORMATS = /\.gif$/i;
const DEFAULT_AUTO_PLAY_INTERVAL = 5000;
const SLIDE_TRANSITION_DURATION = 500;

export function ImageGallery({ items, className, autoPlay = true, autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL, showThumbnails = true }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Memoized helper functions
  const isVideo = React.useCallback((url: string) => SUPPORTED_VIDEO_FORMATS.test(url), []);

  const isGif = React.useCallback((url: string) => SUPPORTED_GIF_FORMATS.test(url), []);

  const getSlideTransform = React.useCallback(
    (index: number) => {
      if (index === currentIndex) return "translate-x-0 opacity-100";
      return index < currentIndex ? "-translate-x-full opacity-0" : "translate-x-full opacity-0";
    },
    [currentIndex]
  );

  // Navigation functions
  const goToSlide = React.useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  // Auto play management
  const startAutoPlay = React.useCallback(() => {
    if (!autoPlay || items.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const stopAutoPlay = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto play effect
  React.useEffect(() => {
    if (isPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [isPlaying, startAutoPlay, stopAutoPlay]);

  // Pause auto play on hover
  const handleMouseEnter = React.useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    if (autoPlay) setIsPlaying(true);
  }, [autoPlay]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case " ": // Spacebar
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Early return for empty items
  if (!items || items.length === 0) {
    return (
      <div className={cn("w-full border rounded-lg bg-muted", className)}>
        <div className="aspect-video flex items-center justify-center text-muted-foreground">No media available</div>
      </div>
    );
  }

  const hasMultipleItems = items.length > 1;

  return (
    <div className={cn("w-full border rounded-lg overflow-hidden", className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Main Carousel */}
      <div className="relative aspect-video w-full overflow-hidden">
        {items.map((src, index) => {
          const isCurrentSlide = index === currentIndex;
          const shouldRender = Math.abs(index - currentIndex) <= 1 || (currentIndex === 0 && index === items.length - 1) || (currentIndex === items.length - 1 && index === 0);

          if (!shouldRender) return null;

          return (
            <div
              key={`slide-${index}`}
              className={cn("absolute inset-0 transition-all duration-500 ease-in-out", getSlideTransform(index))}
              style={{
                transitionDuration: `${SLIDE_TRANSITION_DURATION}ms`,
              }}
            >
              {isVideo(src) ? (
                <video
                  src={src}
                  className="h-full w-full object-cover"
                  controls={isCurrentSlide}
                  muted
                  playsInline
                  preload="metadata"
                  onLoadStart={() => {
                    if (isCurrentSlide) setIsPlaying(false);
                  }}
                />
              ) : isGif(src) ? (
                <img src={src} alt={`Media ${index + 1}`} className="h-full w-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
              ) : (
                <Image src={src} alt={`Media ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority={index === 0} quality={index === currentIndex ? 90 : 75} />
              )}
            </div>
          );
        })}

        {/* Navigation buttons */}
        {hasMultipleItems && (
          <>
            <Button className="absolute top-1/2 left-2 -translate-y-1/2" onClick={prevSlide} variant="secondary">
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>

            <Button className="absolute top-1/2 right-2 -translate-y-1/2" onClick={nextSlide} variant="secondary">
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </>
        )}

        {hasMultipleItems && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {items.length}
          </div>
        )}

        {hasMultipleItems && autoPlay && (
          <div className="absolute top-4 left-4">
            <div className={cn("h-2 w-2 rounded-full transition-colors", isPlaying ? "bg-green-500" : "bg-gray-400")} />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && hasMultipleItems && (
        <div className="mt-4 flex gap-2 overflow-x-auto px-2 py-2">
          {items.map((src, index) => (
            <button
              key={`thumb-${index}`}
              className={cn("relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 border", index === currentIndex ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200 hover:border-gray-300")}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {isVideo(src) ? (
                <video src={src} className="h-full w-full object-cover" muted preload="metadata" playsInline />
              ) : isGif(src) ? (
                <img src={src} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              ) : (
                <Image src={src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="64px" quality={60} />
              )}

              {isVideo(src) ? <video src={src} className="h-full w-full object-cover" muted preload="metadata" /> : <Image src={src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
