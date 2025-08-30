"use client";

import { cx } from "cva";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { ToolFilters } from "@/components/web/tools/tool-filter";
import { useFilters } from "@/contexts/filter-context";

export type ToolSearchProps = ComponentProps<"div"> & {
  placeholder?: string;
};

export const ToolSearch = ({ className, placeholder, ...props }: ToolSearchProps) => {
  const { filters, isLoading, updateFilters } = useFilters();

  return (
    <div className={cx("w-full", className)} {...props}>
      <div className="flex items-center justify-end gap-2">
        {/* <div className="w-2/3 flex-1">
          <Input value={filters.q || ""} onChange={(e) => updateFilters({ q: e.target.value })} placeholder={isLoading ? "Loading..." : placeholder || "Search tools..."} className="w-full  rounded-md border px-3 text-sm text-white" />
        </div> */}

        {/* Filters (1/3) */}
        <div className=" flex">
          <ToolFilters />
        </div>
      </div>
    </div>
  );
};
