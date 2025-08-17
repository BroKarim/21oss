"use client";

import { formatDate } from "@primoui/utils";
import { type Ad } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { AdActions } from "./ad-actions";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { Note } from "@/components/ui/note";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";

export const getColumns = (): ColumnDef<Ad>[] => {
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
      accessorKey: "name",
      enableHiding: false,
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const { id, name, faviconUrl } = row.original;

        return <DataTableLink href={`/admin/ads/${id}`} image={faviconUrl} title={name} />;
      },
    },
    {
      accessorKey: "tagline",
      enableSorting: false,
      size: 320,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
      cell: ({ row }) => <Note className="truncate">{row.getValue("tagline")}</Note>,
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <AdActions ad={row.original} className="float-right" />,
    },
  ];
};
