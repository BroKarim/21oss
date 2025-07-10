"use client";

import { useHotkeys } from "@mantine/hooks";
import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { type ComponentProps, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Stack } from "@/components/ui/stack";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import type { DataTableFilterField } from "@/types";
import { cx } from "@/lib/utils";

type DataTableToolbarProps<TData> = ComponentProps<"div"> & {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
};

export function DataTableToolbar<TData>({ table, filterFields = [], children, className, ...props }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys([["/", () => inputRef.current?.focus()]]);

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <Stack size="sm" wrap={false} className={cx("justify-between w-full py-1 -my-1 overflow-auto", className)} {...props}>
      <Stack size="sm" wrap={false}>
        {searchableColumns.map(
          (column) =>
            table.getColumn(column.id) && (
              <div key={String(column.id)} className="relative">
                <Input
                  ref={inputRef}
                  className="w-40 lg:w-60"
                  placeholder={column.placeholder}
                  value={String(table.getColumn(column.id)?.getFilterValue() ?? "")}
                  onChange={(e) => table.getColumn(column.id)?.setFilterValue(e.target.value)}
                />

                <Kbd className="absolute right-2 top-1/2 -translate-y-1/2 m-0 pointer-events-none">/</Kbd>
              </div>
            )
        )}

        {filterableColumns.map((column) => table.getColumn(column.id) && <DataTableFacetedFilter key={String(column.id)} column={table.getColumn(column.id)} title={column.label} options={column.options ?? []} />)}

        {isFiltered && (
          <Button aria-label="Reset filters" variant="ghost" onClick={() => table.resetColumnFilters()}>
            Reset
          </Button>
        )}
      </Stack>

      <Stack size="sm" wrap={false}>
        {children}
      </Stack>
    </Stack>
  );
}
