"use client";

import { formatDate } from "@primoui/utils";
import { type Resource, RCategory } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import { ResourceActions } from "@/app/admin/resources/_components/resource-actions"; // BELUM DIBUAT
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/components/ui/note";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableLink } from "@/components/data-table/data-table-link";
import { ExternalLink } from "lucide-react";

export const getColumns = (): ColumnDef<Resource>[] => {
  // Map warna Badge untuk Category
  const categoryBadges: Record<RCategory, ComponentProps<typeof Badge>> = {
    [RCategory.Template]: { variant: "soft" },
    [RCategory.Component]: { variant: "soft" },
    [RCategory.Asset]: { variant: "success" },
    [RCategory.Inspiration]: { variant: "success" },
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
      size: 180,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const { name, slug, media } = row.original;

        // Gunakan media[0] sebagai image/favicon
        const imageUrl = media[0];

        return <DataTableLink href={`/admin/resources/${slug}`} image={imageUrl} title={name} />;
      },
    },
    {
      accessorKey: "category",
      size: 140,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <Badge {...categoryBadges[row.original.category]}>{row.original.category}</Badge>,
    },
    {
      accessorKey: "websiteUrl",
      enableSorting: false,
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
      cell: ({ row }) => {
        const url = row.original.websiteUrl;
        if (!url) return <Note>—</Note>;

        // Tampilkan link dengan icon
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors text-sm truncate">
            {new URL(url).hostname}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        );
      },
    },
    {
      accessorKey: "repoUrl",
      enableSorting: false,
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Repository" />,
      cell: ({ row }) => {
        const url = row.original.repoUrl;
        if (!url) return <Note>—</Note>;

        // Tampilkan link repository
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors text-sm truncate">
            {url.includes("github") ? "GitHub" : "Repo Link"}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        );
      },
    },
    {
      accessorKey: "mediaCount",
      size: 100,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Media" />,
      cell: ({ row }) => {
        const count = row.original.media.length;
        return <Note>{count > 0 ? `${count} file(s)` : "None"}</Note>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ResourceActions resource={row.original} className="float-right" />,
    },
  ];
};
