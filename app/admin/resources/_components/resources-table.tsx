"use client";

import { RCategory, type Resource } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { use, useMemo } from "react";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/hooks/use-data-table";
import type { findResources } from "@/server/admin/resources/queries";
import { resourcesTableParamsSchema } from "@/server/admin/resources/schema";
import type { DataTableFilterField } from "@/types";
import { getColumns } from "./resources-table-columns";

import { ResourcesTableToolbarActions } from "./resources-table-toolbar-actions";

import { Plus } from "lucide-react";

type ResourcesTableProps = {
  resourcesPromise: ReturnType<typeof findResources>;
};

export function ResourcesTable({ resourcesPromise }: ResourcesTableProps) {
  const { resources, total, pageCount } = use(resourcesPromise);
  const [{ perPage, sort }] = useQueryStates(resourcesTableParamsSchema);

  const columns = useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Resource>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
    {
      id: "category", // Filter berdasarkan category
      label: "Category",
      options: Object.values(RCategory).map((cat) => ({
        label: cat,
        value: cat,
        // Icon bisa ditambahkan jika ada mapping icon khusus
      })),
    },
  ];

  const { table } = useDataTable({
    data: resources,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort as any,
      // Hiding columns by default (sesuaikan kebutuhan)
      columnVisibility: { websiteUrl: true, repoUrl: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Resources" // Ganti Title
        total={total}
        callToAction={
          <Button variant="primary" size="md" prefix={<Plus />} asChild>
            <Link href="/admin/resources/new">
              <div className="max-sm:sr-only">New Resource</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ResourcesTableToolbarActions table={table} />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  );
}
