"use client";

import { isValidUrl } from "@primoui/utils";
import type { Ad } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { AdsDeleteDialog } from "./ads-delete-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { cx } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

type AdActionsProps = ComponentProps<typeof Button> & {
  ad: Ad;
};

export const AdActions = ({ className, ad, ...props }: AdActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {pathname !== `/admin/ads/${ad.id}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/ads/${ad.id}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        {isValidUrl(ad.websiteUrl ?? undefined) && (
          <DropdownMenuItem asChild>
            <Link href={ad.websiteUrl!} target="_blank">
              Visit website
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AdsDeleteDialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(false)} ads={[ad]} showTrigger={false} onSuccess={() => router.push("/admin/ads")} />
    </DropdownMenu>
  );
};
