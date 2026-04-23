"use client";
import { useMemo, useState, useEffect, useRef, useCallback, useTransition } from "react";
import { ToolType, TemplateType } from "@prisma/client";
import type { ToolList } from "@/server/web/tools/payloads";
import { ResourceCard, ResourceCardSkeleton } from "@/components/web/tools/resources/resources-card";
import { AdCard } from "@/components/web/tools/resources/ad-card";
import { loadMoreResources } from "@/server/web/tools/actions";
import { useFilters } from "@/contexts/filter-context";
type AdItem = {
  id: string;
  name: string;
  description: string | null;
  affiliateUrl: string | null;
  websiteUrl: string;
  buttonLabel: string | null;
  faviconUrl: string | null;
};
type GridItem = { kind: "resource"; data: ToolList } | { kind: "ad"; data: AdItem };
const COLS = 3;
const AD_INTERVAL = 15;
function buildGridItems(resources: ToolList[], ads: AdItem[]): GridItem[] {
  if (ads.length === 0) return resources.map((data) => ({ kind: "resource", data }));
  const result: GridItem[] = [];
  let adIndex = 0;
  let resourceIdx = 0;
  let nextAdAtResource = AD_INTERVAL;
  while (resourceIdx < resources.length) {
    result.push({ kind: "resource", data: resources[resourceIdx]! });
    resourceIdx++;
    if (resourceIdx >= nextAdAtResource) {
      const currentPos = result.length;
      const remainder = currentPos % COLS;
      if (remainder === COLS - 1) {
        result.push({ kind: "ad", data: ads[adIndex % ads.length]! });
        adIndex++;
        nextAdAtResource = resourceIdx + AD_INTERVAL;
      } else {
        const padding = (COLS - 1 - remainder + COLS) % COLS;
        for (let p = 0; p < padding && resourceIdx < resources.length; p++) {
          result.push({ kind: "resource", data: resources[resourceIdx]! });
          resourceIdx++;
        }
        if (result.length % COLS === COLS - 1) {
          result.push({ kind: "ad", data: ads[adIndex % ads.length]! });
          adIndex++;
        }
        nextAdAtResource = resourceIdx + AD_INTERVAL;
      }
    }
  }
  return result;
}
type ResourceGridProps = {
  initialResources: ToolList[];
  initialNextCursor: string | undefined;
  initialHasMore: boolean;
  totalCount: number;
  toolPageAds: AdItem[];
  title: string;
  description: string;
};
const SKELETON_COUNT = 6;
export function ResourceGrid({ initialResources, initialNextCursor, initialHasMore, totalCount, toolPageAds, title, description }: ResourceGridProps) {
  const { filters, updateFilters, isLoading } = useFilters();
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<ToolList[]>(initialResources);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  useEffect(() => {
    setResources(initialResources);
    setNextCursor(initialNextCursor);
    setHasMore(initialHasMore);
  }, [initialResources, initialNextCursor, initialHasMore]);
  const activeStackSlugs = useMemo(() => filters.stack?.split(",").filter(Boolean) ?? [], [filters.stack]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((tool) => {
      const matchSearch = !query || tool.name.toLowerCase().includes(query) || tool.slug.toLowerCase().includes(query) || (tool.tagline ?? "").toLowerCase().includes(query);
      const matchStack = !activeStackSlugs.length || tool.stacks.some((stack) => activeStackSlugs.includes(stack.slug));
      return matchSearch && matchStack;
    });
  }, [resources, search, activeStackSlugs]);
  const loadMore = useCallback(async () => {
    if (!nextCursor || !hasMore || loadingRef.current) return;
    loadingRef.current = true;
    startTransition(async () => {
      try {
        const result = await loadMoreResources({ ...filters, type: ToolType.Template }, nextCursor);
        setResources((prev) => [...prev, ...result.items]);
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } finally {
        loadingRef.current = false;
      }
    });
  }, [filters, nextCursor, hasMore]);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "400px",
        threshold: 0,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);
  return (
    <div className="flex-1">
      <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-xl">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="border-border bg-background focus:border-primary/40 focus:ring-primary/20 h-9 rounded-lg border px-3 text-sm outline-none focus:ring-1"
                value={filters.templateType ?? "all"}
                disabled={isLoading}
                onChange={(e) => updateFilters({ templateType: e.target.value as TemplateType | "all" })}
              >
                <option value="all">All</option>
                <option value={TemplateType.Website}>Website</option>
                <option value={TemplateType.Mobile}>Mobile</option>
                <option value={TemplateType.Dashboard}>Dashboard</option>
              </select>
              <div className="relative">
                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 h-9 w-64 rounded-lg border pr-3 pl-9 text-sm outline-none focus:ring-1"
                />
              </div>
              {}
              <span className="text-muted-foreground text-xs tabular-nums">{search ? `${filtered.length} results` : `${totalCount} templates`}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2" />
          </div>
        </div>
      </header>
      {}
      <div className="p-8">
        {filtered.length === 0 && !isPending ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 text-sm font-medium">No templates found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildGridItems(filtered, toolPageAds).map((item, i) => (item.kind === "ad" ? <AdCard key={`ad-${item.data.id}-${i}`} ad={item.data} /> : <ResourceCard key={item.data.id} tool={item.data} />))}
              {}
              {isPending && Array.from({ length: SKELETON_COUNT }).map((_, i) => <ResourceCardSkeleton key={`skeleton-${i}`} />)}
            </div>
            {}
            {hasMore && !search && <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />}
            {}
            {!hasMore && resources.length > 0 && !search && <p className="text-muted-foreground mt-12 text-center text-sm">All {resources.length} templates loaded</p>}
          </>
        )}
      </div>
    </div>
  );
}
