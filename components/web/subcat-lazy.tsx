"use client";

import { useEffect, useRef, useState } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolGalleryGroup } from "./tools/groups/tool-gallery-groups";
import * as toolsActions from "@/server/web/tools/actions";

interface ToolsBySubcategoryLazyProps {
  subcategorySlug: string;
  subcategoryLabel?: string;
}

export default function ToolsBySubcategoryLazy({ subcategorySlug, subcategoryLabel }: ToolsBySubcategoryLazyProps) {
  const [tools, setTools] = useState<ToolMany[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !hasLoaded && !isLoading) {
          setIsLoading(true);
          try {
            const fetched = await toolsActions.getToolsBySubcategory(subcategorySlug);
            setTools(fetched);
            setHasLoaded(true);
          } catch (error) {
            console.error(`Failed to load tools for subcategory: ${subcategorySlug}`, error);
            setTools([]);
            setHasLoaded(true);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [subcategorySlug, hasLoaded, isLoading]);

  return (
    <div ref={ref} className="space-y-2">
      {isLoading || !hasLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded bg-muted" />
          ))}
        </div>
      ) : tools && tools.length > 0 ? (
        <ToolGalleryGroup id={subcategorySlug} label={subcategoryLabel ?? ""} tools={tools} showGlowingEffect={false} options={{ showViewAll: false, loadMore: true }} />
      ) : (
        <p className="text-muted-foreground text-sm">No tools found in this category.</p>
      )}
    </div>
  );
}
