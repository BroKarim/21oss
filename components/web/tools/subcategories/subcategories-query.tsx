"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolGalleryGroup } from "../groups/tool-gallery-groups";
import * as toolsActions from "@/server/web/tools/actions";
import { useFilters } from "@/contexts/filter-context";
interface ToolsBySubcategoryLazyProps {
  subcategorySlug: string;
  subcategoryLabel?: string;
}

export default function ToolsBySubcategoryLazy({ subcategorySlug, subcategoryLabel }: ToolsBySubcategoryLazyProps) {
  const [tools, setTools] = useState<ToolMany[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useFilters();

  const fetchTools = useCallback(
    async (currentFilters: typeof filters) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const fetched = await toolsActions.getToolsBySubcategory(subcategorySlug, {
          q: currentFilters.q || undefined,
          stack: currentFilters.stack,
          license: currentFilters.license,
          platform: currentFilters.platform,
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
    [subcategorySlug, isLoading]
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          fetchTools(filters);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchTools, hasLoaded, filters]);

  useEffect(() => {
    if (!hasLoaded) return;

    const timeoutId = setTimeout(() => {
      fetchTools(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, hasLoaded, fetchTools]);

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
          <button onClick={() => fetchTools(filters)} className="mt-2 px-4 py-2 border rounded-md hover:bg-muted">
            Try Again
          </button>
        </div>
      ) : tools && tools.length > 0 ? (
        <ToolGalleryGroup id={subcategorySlug} label={subcategoryLabel ?? ""} tools={tools} showGlowingEffect={false} options={{ showViewAll: false, loadMore: true }} />
      ) : hasLoaded ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tools found{filters ? " with current filters" : ""}.</p>
        </div>
      ) : null}
    </div>
  );
}
