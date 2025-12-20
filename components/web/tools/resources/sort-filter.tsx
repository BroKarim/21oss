"use client";

import * as React from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { SORT_OPTIONS, type SortOption } from "@/server/web/shared/schema";
import { Button } from "@/components/ui/button-shadcn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const LABELS: Record<SortOption, string> = {
  stars: "Most Stars",
  latest: "Recently Updated",
  oldest: "Oldest Repos",
};

export function SortFilter() {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringEnum([...SORT_OPTIONS]) 
      .withOptions({ shallow: false }) 
  );

  const onSelect = (value: SortOption) => {
    setSort(sort === value ? null : value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="h-9 gap-1 w-24 rounded-full">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-48 p-1">
        {SORT_OPTIONS.map((option) => {
          const active = sort === option;

          return (
            <button key={option} onClick={() => onSelect(option)} className={cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted", active && "bg-muted")}>
              <span>{LABELS[option]}</span>
              {active && <Check className="h-4 w-4" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
