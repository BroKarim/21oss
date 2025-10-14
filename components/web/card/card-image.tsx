"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ComponentPreviewImageProps {
  src?: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
  priority?: boolean;
}

export default function ComponentPreviewImage({ src, alt, fallbackSrc, className, priority = false }: ComponentPreviewImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative w-full h-full ${className || ""}`}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-t-lg" />}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 350px"
        className={cn("object-cover rounded-t-lg transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        quality={75}
        placeholder="empty"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEhGNyaMcVtNvQJCNl2Z3ilaTf3R0xCKG9w8K/W9u4Gz+F6+kWYzFPQrx5I9L1+sYDKS6Q=="
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-t-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image failed</span>
          </div>
        </div>
      )}
    </div>
  );
}
