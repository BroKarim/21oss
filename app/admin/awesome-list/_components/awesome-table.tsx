"use client";

import { useQueryStates } from "nuqs";
import { use, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/hooks/use-data-table";
import type { findAwesomeLists } from "@/server/admin/awesome-list/queries";
import { awesomeListTableParamsSchema } from "@/server/admin/awesome-list/schema";
import { getColumns } from "./awesome-table-columns";
import { AwesomeTableToolbarActions } from "./awesome-table-toolbar-actions";
import { Plus } from "lucide-react";
import { FetchButton } from "@/components/admin/fetch-button";
import { fetchAllAwesomeRepositoryData } from "@/server/admin/awesome-list/actions";

type AwesomeTableProps = {
  awesomePromise: ReturnType<typeof findAwesomeLists>;
};

export function AwesomeTable({ awesomePromise }: AwesomeTableProps) {
  const { awesomeLists, awesomeListsTotal, pageCount } = use(awesomePromise);
  const [{ perPage, sort }] = useQueryStates(awesomeListTableParamsSchema);

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: awesomeLists,
    columns,
    pageCount,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnVisibility: { createdAt: false, updatedAt: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader
          title="Awesome List"
          total={awesomeListsTotal}
          callToAction={
            <Button variant="primary" size="md" prefix={<Plus />} asChild>
              <Link href="/admin/awesome-list/new">
                <div className="max-sm:sr-only">New Awesome</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table}>
            <AwesomeTableToolbarActions table={table} />
            <FetchButton action={fetchAllAwesomeRepositoryData} buttonText="Fetch Tool Repository Data" successMessage="✅ All tool repositories data fetched successfully." className="w-fit" />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>
    </>
  );
}
