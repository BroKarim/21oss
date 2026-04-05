"use client";

import NextLink from "next/link";
import { type ComponentProps, useState } from "react";

export const Link = ({ prefetch: nextPrefetch, className, ...props }: ComponentProps<typeof NextLink>) => {
  const [prefetch, setPrefetch] = useState(nextPrefetch ?? false);

  return (
    <NextLink
      prefetch={prefetch}
      onMouseEnter={() => setPrefetch(true)}
      className={className ?? "text-[#0099ff] underline underline-offset-[0.2em] hover:opacity-80"}
      {...props}
    />
  );
};
