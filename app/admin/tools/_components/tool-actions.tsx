"use client";

import { isValidUrl } from "@primoui/utils";
import type { Tool } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { ToolsDeleteDialog } from "@/app/admin/tools/_components/tools-delete-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { fetchToolRepositoryData } from "@/server/admin/tools/actions";
import { cx } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

type ToolActionsProps = ComponentProps<typeof Button> & {
  tool: Tool;
};
// menampilkan dropdown menu tindakan untuk satu tool di halaman admin, seperti:
// edit tool, hapus tool dll
export const ToolActions = ({ className, tool, ...props }: ToolActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Gunakan useServerAction secara langsung (bukan dalam .map)
  const fetchRepo = useServerAction(fetchToolRepositoryData, {
    onSuccess: () => toast.success("Repository data fetched successfully"),
    onError: ({ err }) => toast.error(err.message),
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="secondary" size="sm" prefix={<Ellipsis />} className={cx("data-[state=open]:bg-accent", className)} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {pathname !== `/admin/tools/${tool.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/tools/${tool.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/${tool.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        {/* ✅ Aksi: Fetch Repository */}
        <DropdownMenuItem onSelect={() => fetchRepo.execute({ id: tool.id })}>Fetch Repository Data</DropdownMenuItem>

        <DropdownMenuSeparator />

        {isValidUrl(tool.websiteUrl ?? undefined) && (
          <DropdownMenuItem asChild>
            <Link href={tool.websiteUrl!} target="_blank">
              Visit website
            </Link>
          </DropdownMenuItem>
        )}

        {isValidUrl(tool.repositoryUrl ?? undefined) && (
          <DropdownMenuItem asChild>
            <Link href={tool.repositoryUrl!} target="_blank">
              Visit repository
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ToolsDeleteDialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(false)} tools={[tool]} showTrigger={false} onSuccess={() => router.push("/admin/tools")} />
    </DropdownMenu>
  );
};
