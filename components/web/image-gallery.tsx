"use client";

import { useState, useEffect } from "react";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export default function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (event.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Preview Utama */}
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        <img
          src={images[selectedImageIndex]}
          alt={`Preview ${selectedImageIndex + 1}`}
          className="w-full h-[600px] object-cover transition-all duration-300 ease-in-out"
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-2">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setSelectedImageIndex(index)}
                className={`
                  relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200
                  ${selectedImageIndex === index ? "ring-2 ring-blue-500 scale-105" : "ring-1 ring-gray-200 hover:ring-gray-300 hover:scale-102"}
                `}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover" />

                {/* Active Indicator */}
                {selectedImageIndex === index && <div className="absolute inset-0 bg-blue-500/20" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
