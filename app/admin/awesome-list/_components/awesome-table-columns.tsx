"use client";

import { formatDate } from "@primoui/utils";
import { type AwesomeList, AwesomeCategory } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { Note } from "@/components/ui/note";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";
import { AwesomeActions } from "./awesome-actions";

export const getColumns = (): ColumnDef<AwesomeList>[] => {
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
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const { id, name } = row.original;

        return <DataTableLink href={`/admin/awesome-lists/${id}`} image="https://www.google.com/s2/favicons?sz=96&domain_url=github.com" title={name} />;
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
      accessorKey: "contributors",
      enableSorting: false,
      size: 260,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contributors" />,
      cell: ({ row }) => <Note className="truncate">{row.getValue("contributors")}</Note>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const category = row.getValue<AwesomeCategory>("category");
        return <Note>{category}</Note>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <AwesomeActions awesome={row.original} className="float-right" />,
    },
  ];
};
