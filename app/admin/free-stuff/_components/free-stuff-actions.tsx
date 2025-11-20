"use client";

import type { DevPerk } from "@/generated/prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { cx } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { FreeStuffDeleteDialog } from "./free-stuff-delete-dialog";

type FreeStuffActionsProps = ComponentProps<typeof Button> & {
  perk: DevPerk;
};

export const FreeStuffActions = ({ className, perk, ...props }: FreeStuffActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {pathname !== `/admin/free-stuff/${perk.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/free-stuff/${perk.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/free/${perk.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {perk.claimUrl && (
          <DropdownMenuItem asChild>
            <Link href={perk.claimUrl} target="_blank">
              Claim
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <FreeStuffDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        items={[perk]}
        showTrigger={false}
        onSuccess={() => {
          router.push("/admin/free-stuff");
        }}
      />
    </DropdownMenu>
  );
};
