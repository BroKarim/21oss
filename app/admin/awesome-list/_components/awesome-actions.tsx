"use client";

import type { AwesomeList } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { cx } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { AwesomeDeleteDialog } from "./awesome-delete-dialog"; 

type AwesomeActionsProps = ComponentProps<typeof Button> & {
  awesome: AwesomeList;
};

export const AwesomeActions = ({ className, awesome, ...props }: AwesomeActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {pathname !== `/admin/awesome/${awesome.id}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/awesome/${awesome.id}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        {awesome.repositoryUrl && (
          <DropdownMenuItem asChild>
            <Link href={awesome.repositoryUrl} target="_blank">
              Visit repo
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AwesomeDeleteDialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(false)} awesomes={[awesome]} showTrigger={false} onSuccess={() => router.push("/admin/awesome")} />
    </DropdownMenu>
  );
};
