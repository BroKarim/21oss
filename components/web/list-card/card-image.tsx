"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
interface ComponentPreviewImageProps {
  src: string | null;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export default function ComponentPreviewImage({ src, alt, fallbackSrc, className }: ComponentPreviewImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={350}
      height={190}
      className={`object-cover rounded-t-lg ${className}`}
      placeholder="blur"
      blurDataURL={fallbackSrc}
      onError={() => setImgSrc(fallbackSrc)}
      style={{
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
