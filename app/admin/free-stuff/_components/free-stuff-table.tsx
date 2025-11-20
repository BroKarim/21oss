"use client";

import { use, useMemo } from "react";
import { useQueryStates } from "nuqs";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/hooks/use-data-table";

import type { findFreeStuff } from "@/server/admin/free-stuff/queries";
import { freeStuffTableParamsSchema } from "@/server/admin/free-stuff/schema";
import type { DataTableFilterField } from "@/types";

import { getColumns } from "./free-stuff-table-columns";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Plus } from "lucide-react";

type FreeStuffTableProps = {
  freeStuffPromise: ReturnType<typeof findFreeStuff>;
};

export function FreeStuffTable({ freeStuffPromise }: FreeStuffTableProps) {
  const { items, total, pageCount } = use(freeStuffPromise);
  const [{ perPage, sort }] = useQueryStates(freeStuffTableParamsSchema);

  const columns = useMemo(() => getColumns(), []);

  // Filters
  const filterFields: DataTableFilterField<any>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
    {
      id: "category",
      label: "Category",
      options: [
        { label: "Developer", value: "Developer" },
        { label: "Student", value: "Student" },
        { label: "Designer", value: "Designer" },
        { label: "Creator", value: "Creator" },
      ],
    },
  ];

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort as any,
      columnVisibility: {},
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Free Stuff"
        total={total}
        callToAction={
          <Button variant="primary" size="md" prefix={<Plus />} asChild>
            <Link href="/admin/free-stuff/new">
              <div className="max-sm:sr-only">New Item</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  );
}
