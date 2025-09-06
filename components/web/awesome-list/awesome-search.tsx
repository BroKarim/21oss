"use client";

import { cx } from "cva";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button-shadcn";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useFilters } from "@/contexts/filter-context";

const awesomeCategories = ["Programming", "Productivity", "Data", "Learning", "Design"] as const;

export type AwesomeSearchProps = ComponentProps<"div"> & {
  placeholder?: string;
};

export const AwesomeSearch = ({ className, placeholder, ...props }: AwesomeSearchProps) => {
  const { filters, isLoading, updateFilters } = useFilters();

  const selectedCategory = filters.category?.[0] ?? "";

  return (
    <div className={cx("w-full", className)} {...props}>
      <div className="flex items-center justify-end gap-2">
        {/* Search input */}
        <div className="w-2/3 flex-1">
          <Input
            value={filters.q || ""}
            onChange={(e) => updateFilters({ q: e.target.value })}
            placeholder={isLoading ? "Loading..." : placeholder || "Search awesome lists..."}
            className="w-full rounded-md border px-3 text-sm text-white"
          />
        </div>

        {/* Category dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span>{selectedCategory || "All Categories"}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateFilters({ category: [] })}>All Categories</DropdownMenuItem>
            {awesomeCategories.map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => updateFilters({ category: [cat] })}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
