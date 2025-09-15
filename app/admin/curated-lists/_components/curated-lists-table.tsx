"use client";

import type { CuratedList } from "@prisma/client";
import { use } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/hooks/use-data-table";
import type { findCuratedLists } from "@/server/admin/curated-list/queries";
import type { DataTableFilterField } from "@/types";
import { getColumns } from "./curated-lists-table-columns";
import { Plus } from "lucide-react";

type CuratedListsTableProps = {
  curatedListsPromise: ReturnType<typeof findCuratedLists>;
};

export function CuratedListsTable({ curatedListsPromise }: CuratedListsTableProps) {
 const { curatedLists } = use(curatedListsPromise);

  // Kolom disiapkan terpisah biar modular
  const columns = useMemo(() => getColumns(), []);

  // Filter opsional, misalnya by title
  const filterFields: DataTableFilterField<CuratedList>[] = [
    {
      id: "title",
      label: "Title",
      placeholder: "Search by title...",
    },
  ];

  const { table } = useDataTable({
    data: curatedLists,
    columns,
    pageCount: 1, // sementara statis
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Curated Lists"
        total={curatedLists.length}
        callToAction={
          <Button variant="primary" size="md" prefix={<Plus />} asChild>
            <Link href="/admin/curated-lists/new">
              <div className="max-sm:sr-only">New curated list</div>
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
