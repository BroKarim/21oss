"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  items: string[]; 
  className?: string;
}

export function ImageGallery({ items, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const autoPlay = true; 
  const autoPlayInterval = 5000;
  const showThumbnails = true;

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Auto play
  React.useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  // Keyboard nav
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("w-full border", className)}>
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video w-full overflow-hidden">
          {items.map((src, index) => (
            <div
              key={`slide-${index}`}
              className={cn("absolute inset-0 transform transition-all duration-500 ease-in-out", index === currentIndex ? "translate-x-0 opacity-100" : index < currentIndex ? "-translate-x-full opacity-0" : "translate-x-full opacity-0")}
            >
              {isVideo(src) ? <video src={src} className="h-full w-full object-cover" controls /> : <Image src={src} alt={`Media ${index + 1}`} fill className="object-cover" sizes="100vw" />}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        {items.length > 1 && (
          <>
            <Button className="absolute top-1/2 left-2 -translate-y-1/2" onClick={prevSlide} variant="secondary">
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>

            <Button className="absolute top-1/2 right-2 -translate-y-1/2" onClick={nextSlide} variant="secondary">
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Counter */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && items.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto px-2 py-2">
          {items.map((src, index) => (
            <button
              key={`thumb-${index}`}
              className={cn("relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 border", index === currentIndex ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200 hover:border-gray-300")}
              onClick={() => setCurrentIndex(index)}
            >
              {isVideo(src) ? <video src={src} className="h-full w-full object-cover" muted preload="metadata" /> : <Image src={src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
