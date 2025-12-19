"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { SORT_OPTIONS, type SortOption } from "@/server/web/shared/schema";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LABELS: Record<SortOption, string> = {
  stars: "Most Stars",
  latest: "Recently Updated",
  oldest: "Oldest Repos",
};

export function SortFilter() {
  const [sort, setSort] = useQueryState("sort", {
    shallow: false,
  });

  const handleSelect = (value: string) => {
    if (sort === value) {
      setSort(null);
    } else {
      setSort(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="h-9 gap-2">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">{sort ? LABELS[sort as SortOption] : "Sort by"}</span>
          <span className="sm:hidden">Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem key={option} checked={sort === option} onCheckedChange={() => handleSelect(option)}>
            {LABELS[option]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
