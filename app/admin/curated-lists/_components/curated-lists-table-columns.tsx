"use client";

import { formatDate } from "@primoui/utils";
import type { CuratedList, Tool } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";
import { Note } from "@/components/ui/note";
import { CuratedListActions } from "@/app/admin/curated-lists/_components/curated-list-actions";

// tipe untuk row (CuratedList + daftar tool yang dipilih)
export type CuratedListWithTools = CuratedList & {
  tools: Tool[];
};

export const getColumns = (): ColumnDef<CuratedList>[] => {
  return [
    {
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <RowCheckbox
          checked={table.getIsAllPageRowsSelected()}
          ref={(input) => {
            if (input) {
              input.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
            }
          }}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => <RowCheckbox checked={row.getIsSelected()} onChange={(e) => row.toggleSelected(e.target.checked)} aria-label="Select row" />,
    },
    {
      accessorKey: "title",
      enableHiding: false,
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <DataTableLink href={`/admin/curated-lists/${row.original.id}`} title={row.original.title} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => <Note>{formatDate(cell.getValue() as Date)}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <CuratedListActions curatedList={row.original} className="float-right" />,
    },
  ];
};
