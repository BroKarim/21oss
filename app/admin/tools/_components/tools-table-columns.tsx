"use client";

import { formatDate } from "@primoui/utils";
import { type Tool, ToolStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import { ToolActions } from "@/app/admin/tools/_components/tool-actions";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/components/ui/note";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";

export const getColumns = (): ColumnDef<Tool>[] => {
  const statusBadges: Record<ToolStatus, ComponentProps<typeof Badge>> = {
    [ToolStatus.Draft]: {
      variant: "soft",
    },
    [ToolStatus.Published]: {
      variant: "success",
    },
  };

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
        const { name, slug, faviconUrl } = row.original;

        return (
          <div className="w-[220px]">
            <DataTableLink href={`/admin/tools/${slug}`} image={faviconUrl} title={name} />
          </div>
        );
      },
    },
    {
      accessorKey: "tagline",
      enableSorting: false,
      size: 320,
      header: ({ column }) => (
        <div className="w-[320px]">
          <DataTableColumnHeader column={column} title="Tagline" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-[320px] max-w-[320px] overflow-x-auto">
          <Note className="whitespace-nowrap">{row.getValue("tagline")}</Note>
        </div>
      ),
    },
    {
      accessorKey: "submitterEmail",
      header: ({ column }) => (
        <div className="w-[200px]">
          <DataTableColumnHeader column={column} title="Submitter" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">
          <Note className="text-sm truncate">{row.getValue("submitterEmail")}</Note>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <Badge {...statusBadges[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "pageviews",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pageviews" />,
      cell: ({ row }) => <Note>{row.getValue("pageviews")?.toLocaleString()}</Note>,
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
      cell: ({ row }) => (row.original.publishedAt ? <Note>{formatDate(row.getValue<Date>("publishedAt"))}</Note> : <Note>—</Note>),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ToolActions tool={row.original} className="float-right" />,
    },
  ];
};
