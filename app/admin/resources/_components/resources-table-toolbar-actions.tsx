"use client";

import type { Resource } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import { ResourcesDeleteDialog } from "./resources-delete-dialog";

interface ResourcesTableToolbarActionsProps {
  table: Table<Resource>;
}

export function ResourcesTableToolbarActions({ table }: ResourcesTableToolbarActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return <>{selectedRows.length > 0 ? <ResourcesDeleteDialog resources={selectedRows.map((row) => row.original)} onSuccess={() => table.toggleAllRowsSelected(false)} /> : null}</>;
}
