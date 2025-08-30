// components/web/tools/tool-filters.tsx
"use client";

import { useEffect } from "react";
import { useServerAction } from "zsa-react";
import { findFilterOptions } from "@/actions/filters";
import { Badge } from "@/components/ui/badge";

import { ToolRefinement } from "./tool-refinement";
import { searchConfig } from "@/config/search";
import { useFilters } from "@/contexts/filter-context";
import type { FilterType } from "@/types/search";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button-shadcn";

export const ToolFilters = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { filters, updateFilters } = useFilters();
  const { execute, isPending, data } = useServerAction(findFilterOptions);

  useEffect(() => {
    execute();
  }, [execute]);

  const hasActiveFilters = searchConfig.filters.some((type) => !!filters[type].length);

  const handleClearAll = () => {
    const cleared = Object.fromEntries(searchConfig.filters.map((f) => [f, []]));
    updateFilters(cleared);
  };

  return (
    <div className={cn("flex  gap-2", className)} {...props}>
      {searchConfig.filters.map((type) => (
        <DropdownMenu key={type}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span className="capitalize">{type}</span>
              {filters[type].length > 0 && <Badge>{filters[type].length}</Badge>}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 p-0">
            <DropdownMenuLabel className="capitalize">{type}</DropdownMenuLabel>
            <ToolRefinement filter={type as FilterType} items={data?.[type] ?? []} isPending={isPending} />
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          Clear all
        </Button>
      )}
    </div>
  );
};
