"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolGalleryGroup } from "../groups/tool-gallery-groups";
import * as toolsActions from "@/server/web/tools/actions";

interface ToolsBySubcategoryLazyProps {
  subcategorySlug: string;
  subcategoryLabel?: string;
  stack?: string;
  license?: string;
  platform?: string;
}

export default function ToolsBySubcategoryLazy({ subcategorySlug, subcategoryLabel, stack, license, platform }: ToolsBySubcategoryLazyProps) {
  const [tools, setTools] = useState<ToolMany[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(
    async (filters?: { stack?: string; license?: string; platform?: string }) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const fetched = await toolsActions.getToolsBySubcategory(subcategorySlug, {
          stack: filters?.stack ? [filters.stack] : undefined,
          license: filters?.license ? [filters.license] : undefined,
          platform: filters?.platform ? [filters.platform] : undefined,
        });

        setTools(fetched);
        setHasLoaded(true);
      } catch (err) {
        console.error(`Failed to load tools for subcategory: ${subcategorySlug}`, err);
        setTools([]);
      } finally {
        setIsLoading(false);
      }
    },
    [subcategorySlug]
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          fetchTools();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchTools, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) return;

    const timeoutId = setTimeout(() => {
      fetchTools({ stack, license, platform });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [stack, license, platform, hasLoaded]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          fetchTools();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchTools, hasLoaded]);

  useEffect(() => {
    if (hasLoaded && (stack || license || platform)) {
      const timeoutId = setTimeout(() => {
        fetchTools({ stack, license, platform });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [stack, license, platform, hasLoaded]);

  return (
    <div ref={ref} className="space-y-2">
      {isLoading && !hasLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
          <button onClick={() => fetchTools()} className="mt-2 px-4 py-2 border rounded-md hover:bg-muted">
            Try Again
          </button>
        </div>
      ) : tools && tools.length > 0 ? (
        <ToolGalleryGroup id={subcategorySlug} label={subcategoryLabel ?? ""} tools={tools} showGlowingEffect={false} options={{ showViewAll: false, loadMore: true }} />
      ) : hasLoaded ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tools found{stack || license || platform ? " with current filters" : ""}.</p>
        </div>
      ) : null}
    </div>
  );
}
