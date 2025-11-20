"use client";

import { formatDate } from "@primoui/utils";
import { type DevPerk } from "@/generated/prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/components/ui/note";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";
import { FreeStuffActions } from "./free-stuff-actions";

export const getColumns = (): ColumnDef<DevPerk>[] => {
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
      size: 180,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const { name, slug, logoUrl } = row.original;

        return <DataTableLink href={`/admin/free-stuff/${slug}`} image={logoUrl || undefined} title={name} />;
      },
    },

    {
      accessorKey: "type",
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },

    {
      accessorKey: "value",
      size: 140,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
      cell: ({ row }) => <Note>{row.getValue("value") || "—"}</Note>,
    },

    {
      accessorKey: "isFree",
      size: 80,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Free" />,
      cell: ({ row }) => <Badge variant={row.getValue("isFree") ? "success" : "soft"}>{row.getValue("isFree") ? "Yes" : "No"}</Badge>,
    },

    {
      accessorKey: "isNew",
      size: 80,
      header: ({ column }) => <DataTableColumnHeader column={column} title="New" />,
      cell: ({ row }) => (row.getValue("isNew") ? <Badge variant="success">New</Badge> : <Note>—</Note>),
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },

    {
      id: "actions",
      cell: ({ row }) => <FreeStuffActions perk={row.original} className="float-right" />,
    },
  ];
};
