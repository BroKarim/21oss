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
import type { findAds } from "@/server/admin/ads/queries";
import { adsTableParamsSchema } from "@/server/admin/ads/schema";
import { getColumns } from "./ads-table-columns";
import { AdsTableToolbarActions } from "./ads-table-toolbar-actions";
import { Plus } from "lucide-react";

type AdsTableProps = {
  adsPromise: ReturnType<typeof findAds>;
};

export function AdsTable({ adsPromise }: AdsTableProps) {
  const { ads, adsTotal, pageCount } = use(adsPromise);
  const [{ perPage, sort }] = useQueryStates(adsTableParamsSchema);

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: ads,
    columns,
    pageCount,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnVisibility: { submitterEmail: false, createdAt: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader
          title="Ads"
          total={adsTotal}
          callToAction={
            <Button variant="primary" size="md" prefix={<Plus />} asChild>
              <Link href="/admin/ads/new">
                <div className="max-sm:sr-only">New Ads</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table}>
            <AdsTableToolbarActions table={table} />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>
    </>
  );
}
