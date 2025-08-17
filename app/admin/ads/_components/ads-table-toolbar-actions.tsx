"use client";

import type { Ad } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import { AdsDeleteDialog } from "./ads-delete-dialog";

interface AdsTableToolbarActionsProps {
  table: Table<Ad>;
}

export function AdsTableToolbarActions({ table }: AdsTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? <AdsDeleteDialog ads={table.getFilteredSelectedRowModel().rows.map((row) => row.original)} onSuccess={() => table.toggleAllRowsSelected(false)} /> : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </>
  );
}
