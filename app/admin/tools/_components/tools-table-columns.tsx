"use client";

import { formatDate } from "@primoui/utils";
import { type Tool, ToolStatus, ToolType } from "@prisma/client";
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

        return <DataTableLink href={`/admin/tools/${slug}`} image={faviconUrl} title={name} />;
      },
    },
    {
      accessorKey: "tagline",
      enableSorting: false,
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
      cell: ({ row }) => <Note className="line-clamp-1 max-w-[200px]">{row.getValue("tagline")}</Note>,
    },
    {
      accessorKey: "submitterEmail",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Submitter" />,
      cell: ({ row }) => <Note className="text-sm">{row.getValue("submitterEmail")}</Note>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <Badge {...statusBadges[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      id: "templateType",
      accessorFn: (row) => {
        if (row.type !== ToolType.Template) return undefined;
        return row.templateType ?? "unset";
      },
      filterFn: (row, id, value) => {
        const selected = value as string[] | undefined;
        if (!selected?.length) return true;
        const v = row.getValue(id) as string | undefined;
        if (!v) return false;
        return selected.includes(v);
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Template Category" />,
      cell: ({ row }) => {
        if (row.original.type !== ToolType.Template) return <Note>—</Note>;
        return <Note>{row.original.templateType ?? "Unset"}</Note>;
      },
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
