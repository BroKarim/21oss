"use client";

import type { Tool } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import { ToolsDeleteDialog } from "./tools-delete-dialog";
import { ToolsTemplateTypeDialog } from "./tools-template-type-dialog";

interface ToolsTableToolbarActionsProps {
  table: Table<Tool>;
}

export function ToolsTableToolbarActions({ table }: ToolsTableToolbarActionsProps) {
  const selected = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  return (
    <>
      {selected.length > 0 ? (
        <>
          <ToolsTemplateTypeDialog tools={selected} onSuccess={() => table.toggleAllRowsSelected(false)} />
          <ToolsDeleteDialog tools={selected} onSuccess={() => table.toggleAllRowsSelected(false)} />
        </>
      ) : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </>
  );
}
