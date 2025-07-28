"use client";

import { useState, useEffect } from "react";

interface ComponentPreviewImageProps {
  src: string | null;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export default function ComponentPreviewImage({ src, alt, fallbackSrc, className }: ComponentPreviewImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isPlaceholder, setIsPlaceholder] = useState(src === fallbackSrc);

  useEffect(() => {
    const finalSrc = src || fallbackSrc;
    setImgSrc(finalSrc);
    setIsPlaceholder(!src || src === fallbackSrc);
  }, [src, fallbackSrc]);


  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`object-cover w-full h-full rounded-t-lg ${className}`}
      onError={() => {
        setImgSrc(fallbackSrc);
        setIsPlaceholder(true);
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center center",
        backgroundColor: isPlaceholder ? "transparent" : "",
      }}
    />
  );
}
