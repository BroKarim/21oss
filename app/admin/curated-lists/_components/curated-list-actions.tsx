"use client";

import type { CuratedList } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { CuratedListsDeleteDialog } from "@/app/admin/curated-lists/_components/curated-list-delete-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { cx } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

type CuratedListActionsProps = ComponentProps<typeof Button> & {
  curatedList: CuratedList;
};

export const CuratedListActions = ({ curatedList, className, ...props }: CuratedListActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {pathname !== `/admin/curated-lists/${curatedList.id}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/curated-lists/${curatedList.id}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <CuratedListsDeleteDialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(false)} curatedLists={[curatedList]} showTrigger={false} onSuccess={() => router.push("/admin/curated-lists")} />
    </DropdownMenu>
  );
};
