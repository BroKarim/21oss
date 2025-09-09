"use client";

import type { AwesomeList } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import { AwesomeDeleteDialog } from "./awesome-delete-dialog";

interface AwesomeTableToolbarActionsProps {
  table: Table<AwesomeList>;
}

export function AwesomeTableToolbarActions({ table }: AwesomeTableToolbarActionsProps) {
  const selectedAwesomes = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  return <>{selectedAwesomes.length > 0 ? <AwesomeDeleteDialog awesomes={selectedAwesomes} showTrigger={false} onSuccess={() => table.toggleAllRowsSelected(false)} /> : null}</>;
}
