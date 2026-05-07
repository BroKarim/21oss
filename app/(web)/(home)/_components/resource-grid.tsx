"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useTransition } from "react";
import { ToolType, TemplateType } from "@prisma/client";
import type { ToolList } from "@/server/web/tools/payloads";
import { ResourceCard, ResourceCardSkeleton } from "@/components/web/tools/resources/resources-card";
import { AdCard } from "@/components/web/tools/resources/ad-card";
import { loadMoreResources, loadMoreTemplateSearchResources } from "@/server/web/tools/actions";
import { useFilters } from "@/contexts/filter-context";
import { AnimatedTabs } from "@/components/web/animated-tabs";

type AdItem = {
  id: string;
  name: string;
  description: string | null;
  affiliateUrl: string | null;
  websiteUrl: string;
  buttonLabel: string | null;
  faviconUrl: string | null;
};

type GridItem = { key: string; kind: "resource"; data: ToolList } | { key: string; kind: "ad"; data: AdItem };

type FeedState = {
  resources: ToolList[];
  nextCursor: string | undefined;
  nextPage: number | null;
  hasMore: boolean;
  sourceKey: string;
};

type ResourceGridProps = {
  initialResources: ToolList[];
  initialNextCursor: string | undefined;
  initialNextPage: number | null;
  initialHasMore: boolean;
  totalCount: number;
  toolPageAds: AdItem[];
  title: string;
  description: string;
};

const COLS = 3;
const AD_INTERVAL = 15;
const SKELETON_COUNT = 6;

function buildGridItems(resources: ToolList[], ads: AdItem[]): GridItem[] {
  if (ads.length === 0) return resources.map((data) => ({ key: data.id, kind: "resource", data }));

  const result: GridItem[] = [];
  let adIndex = 0;
  let resourceIdx = 0;
  let nextAdAtResource = AD_INTERVAL;

  while (resourceIdx < resources.length) {
    result.push({ key: resources[resourceIdx]!.id, kind: "resource", data: resources[resourceIdx]! });
    resourceIdx++;

    if (resourceIdx >= nextAdAtResource) {
      const currentPos = result.length;
      const remainder = currentPos % COLS;

      if (remainder === COLS - 1) {
        result.push({ key: `ad-${ads[adIndex % ads.length]!.id}-${adIndex}`, kind: "ad", data: ads[adIndex % ads.length]! });
        adIndex++;
        nextAdAtResource = resourceIdx + AD_INTERVAL;
      } else {
        const padding = (COLS - 1 - remainder + COLS) % COLS;

        for (let p = 0; p < padding && resourceIdx < resources.length; p++) {
          result.push({ key: resources[resourceIdx]!.id, kind: "resource", data: resources[resourceIdx]! });
          resourceIdx++;
        }

        if (result.length % COLS === COLS - 1) {
          result.push({ key: `ad-${ads[adIndex % ads.length]!.id}-${adIndex}`, kind: "ad", data: ads[adIndex % ads.length]! });
          adIndex++;
        }

        nextAdAtResource = resourceIdx + AD_INTERVAL;
      }
    }
  }

  return result;
}

export function ResourceGrid({ initialResources, initialNextCursor, initialNextPage, initialHasMore, totalCount, toolPageAds, title, description }: ResourceGridProps) {
  const { filters, updateFilters, isLoading } = useFilters();
  const [searchInput, setSearchInput] = useState(filters.q);
  const [isLoadingMore, startLoadingMore] = useTransition();
  const [, refreshFeed] = useReducer((count: number) => count + 1, 0);
  const feedRef = useRef<FeedState | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const activeQuery = filters.q.trim();
  const isSearchMode = activeQuery.length > 0;
  const normalizedInput = searchInput.trim();
  const isSearchSyncing = normalizedInput !== activeQuery;

  const baseFeed = useMemo(
    () => ({
      resources: initialResources,
      nextCursor: initialNextCursor,
      nextPage: initialNextPage,
      hasMore: initialHasMore,
    }),
    [initialResources, initialNextCursor, initialNextPage, initialHasMore],
  );

  const baseFeedKey = `${activeQuery}:${initialResources[0]?.id ?? "empty"}:${initialResources.length}:${initialNextCursor ?? "end"}:${initialNextPage ?? "end"}:${initialHasMore ? 1 : 0}:${totalCount}`;

  const effectiveFeed = feedRef.current?.sourceKey === baseFeedKey ? feedRef.current : baseFeed;
  const showLoadingState = isLoading || isSearchSyncing;

  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  useEffect(() => {
    loadingRef.current = false;
    feedRef.current = null;
  }, [baseFeedKey]);

  useEffect(() => {
    if (normalizedInput === activeQuery) return;

    const timeout = window.setTimeout(() => {
      updateFilters({ q: normalizedInput });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [normalizedInput, activeQuery, updateFilters]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || showLoadingState || !effectiveFeed.hasMore) return;

    loadingRef.current = true;

    startLoadingMore(async () => {
      try {
        if (isSearchMode) {
          if (!effectiveFeed.nextPage) return;

          const result = await loadMoreTemplateSearchResources({ ...filters, type: ToolType.Template }, effectiveFeed.nextPage);
          const current = feedRef.current?.sourceKey === baseFeedKey ? feedRef.current : null;
          const currentResources = current?.resources ?? baseFeed.resources;
          const currentHasMore = current?.hasMore ?? baseFeed.hasMore;
          const currentNextPage = current?.nextPage ?? baseFeed.nextPage;

          if (!currentHasMore || currentNextPage === null) {
            return;
          }

          feedRef.current = {
            sourceKey: baseFeedKey,
            resources: [...currentResources, ...result.items],
            nextCursor: undefined,
            nextPage: result.nextPage,
            hasMore: result.nextPage !== null,
          };
          refreshFeed();
          return;
        }

        if (!effectiveFeed.nextCursor) return;

        const result = await loadMoreResources({ ...filters, type: ToolType.Template }, effectiveFeed.nextCursor);
        const current = feedRef.current?.sourceKey === baseFeedKey ? feedRef.current : null;
        const currentResources = current?.resources ?? baseFeed.resources;
        const currentNextCursor = current?.nextCursor ?? baseFeed.nextCursor;
        const currentHasMore = current?.hasMore ?? baseFeed.hasMore;

        if (!currentNextCursor || !currentHasMore) {
          return;
        }

        feedRef.current = {
          sourceKey: baseFeedKey,
          resources: [...currentResources, ...result.items],
          nextCursor: result.nextCursor,
          nextPage: null,
          hasMore: result.hasMore,
        };
        refreshFeed();
      } finally {
        loadingRef.current = false;
      }
    });
  }, [baseFeed, baseFeedKey, effectiveFeed.hasMore, effectiveFeed.nextCursor, effectiveFeed.nextPage, filters, isSearchMode, showLoadingState]);

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

  const countLabel = isSearchSyncing ? "Searching..." : isSearchMode ? `${totalCount} results` : `${totalCount} templates`;

  return (
    <div className="flex-1">
      <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-xl">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 h-9 w-full rounded-lg border pr-3 pl-9 text-sm outline-none focus:ring-1"
                />
              </div>

              <span className="text-muted-foreground text-xs tabular-nums">{countLabel}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 lg:px-6">
        <AnimatedTabs
          tabs={[
            { label: "All", value: "all" },
            { label: "Website", value: TemplateType.Website },
            { label: "Mobile", value: TemplateType.Mobile },
            { label: "Dashboard", value: TemplateType.Dashboard },
          ]}
          value={(filters.templateType ?? "all") as TemplateType | "all"}
          disabled={isLoading}
          onValueChange={(next) => updateFilters({ templateType: next as TemplateType | "all" })}
          className="justify-self-start"
        />

        {effectiveFeed.resources.length === 0 && !showLoadingState ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 text-sm font-medium">No templates found</p>
            {isSearchMode ? <p className="text-muted-foreground mt-1 text-sm">Try shorter keywords or another stack.</p> : null}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildGridItems(effectiveFeed.resources, toolPageAds).map((item) =>
                item.kind === "ad" ? <AdCard key={item.key} ad={item.data} /> : <ResourceCard key={item.key} tool={item.data} />,
              )}
              {(showLoadingState || isLoadingMore) && Array.from({ length: SKELETON_COUNT }).map((_, index) => <ResourceCardSkeleton key={`skeleton-${index}`} />)}
            </div>

            {effectiveFeed.hasMore && !showLoadingState ? <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" /> : null}

            {!effectiveFeed.hasMore && effectiveFeed.resources.length > 0 && !showLoadingState ? (
              <p className="text-muted-foreground mt-12 text-center text-sm">{isSearchMode ? `Showing all ${effectiveFeed.resources.length} results` : `All ${effectiveFeed.resources.length} templates loaded`}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
