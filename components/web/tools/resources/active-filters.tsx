// components/web/tools/resources/active-filters.tsx
"use client";

import { X } from "lucide-react";
import { useQueryStates, parseAsStringEnum, parseAsString } from "nuqs";
import { SORT_OPTIONS, type SortOption } from "@/server/web/shared/schema";
import { Button } from "@/components/ui/button-shadcn";
import { Badge } from "@/components/ui/badge";

const SORT_LABELS: Record<string, string> = {
  stars: "Most Stars",
  latest: "Recently Updated",
  oldest: "Oldest Repos",
};

type StackItem = { name: string; slug: string };
type PlatformItem = { name: string; slug: string };

type ActiveFiltersProps = {
  stacks: StackItem[];
  platforms: PlatformItem[];
};

export function ActiveFilters({ stacks, platforms }: ActiveFiltersProps) {
  const [params, setParams] = useQueryStates(
    {
      sort: parseAsStringEnum<SortOption>([...SORT_OPTIONS]),
      stack: parseAsString,
      platform: parseAsString,
    },
    {
      shallow: false,
    }
  );

  const { sort, stack, platform } = params;

  // Parse active stacks
  const activeStackSlugs = stack?.split(",").filter(Boolean) ?? [];
  const activeStacks = stacks.filter((s) => activeStackSlugs.includes(s.slug));

  // Find active platform
  const activePlatformObj = platforms.find((p) => p.slug === platform);

  // Clear single filter
  const clearSort = () => setParams({ sort: null });
  const clearStack = (slug: string) => {
    const newStacks = activeStackSlugs.filter((s: any) => s !== slug);
    setParams({ stack: newStacks.length ? newStacks.join(",") : null });
  };
  const clearPlatform = () => setParams({ platform: null });

  // Clear all
  const clearAll = () => setParams({ sort: null, stack: null, platform: null });

  const hasFilters = !!sort || activeStacks.length > 0 || !!platform;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sort && (
        <Badge className="gap-1 pr-1">
          {SORT_LABELS[sort] ?? sort}
          <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full hover:bg-muted" onClick={clearSort}>
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {activeStacks.map((stack) => (
        <Badge key={stack.slug} className="gap-1 pr-1">
          {stack.name}
          <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full hover:bg-muted" onClick={() => clearStack(stack.slug)}>
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {activePlatformObj && (
        <Badge className="gap-1 pr-1">
          {activePlatformObj.name}
          <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full hover:bg-muted" onClick={clearPlatform}>
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground text-xs">
        Clear all
      </Button>
    </div>
  );
}
