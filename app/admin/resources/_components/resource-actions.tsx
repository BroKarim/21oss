"use client";

import { isValidUrl } from "@primoui/utils"; // Asumsi util ini ada
import type { Resource } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ResourcesDeleteDialog } from "./resources-delete-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { cx } from "@/lib/utils";
import { Ellipsis, ExternalLink, Pencil, Eye, Trash } from "lucide-react";

export type ResourceActionsProps = {
  resource: Resource;
  className?: string;
};

export const ResourceActions = ({ className, resource, ...props }: ResourceActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* EDIT */}
        {pathname !== `/admin/resources/${resource.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/resources/${resource.slug}`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}

        {/* VIEW (Public Page - Jika ada) */}
        {/* Asumsi public page ada di /resources/[slug] */}
        <DropdownMenuItem asChild>
          <Link href={`/resources/${resource.slug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* EXTERNAL LINKS */}
        {resource.websiteUrl && isValidUrl(resource.websiteUrl) && (
          <DropdownMenuItem asChild>
            <Link href={resource.websiteUrl} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Link>
          </DropdownMenuItem>
        )}

        {resource.repoUrl && isValidUrl(resource.repoUrl) && (
          <DropdownMenuItem asChild>
            <Link href={resource.repoUrl} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Repository
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* DELETE */}
        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ResourcesDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        resources={[resource]}
        showTrigger={false}
        onSuccess={() => {
          router.push("/admin/resources");
        }}
      />
    </DropdownMenu>
  );
};
