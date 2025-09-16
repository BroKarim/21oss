"use client";

import type { CuratedList } from "@prisma/client";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteCuratedLists } from "@/server/admin/curated-list/actions";
import { Trash } from "lucide-react";

type CuratedListsDeleteDialogProps = ComponentProps<typeof Dialog> & {
  curatedLists: CuratedList[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export const CuratedListsDeleteDialog = ({ curatedLists, showTrigger = true, onSuccess, ...props }: CuratedListsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteCuratedLists, {
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Curated list(s) deleted");
      onSuccess?.();
    },
    onError: ({ err }) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md" prefix={<Trash />}>
            Delete ({curatedLists.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your <span className="font-medium">{curatedLists.length}</span>
            {curatedLists.length === 1 ? " curated list" : " curated lists"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button aria-label="Delete selected rows" size="md" variant="destructive" className="min-w-28" onClick={() => execute({ ids: curatedLists.map(({ id }) => id) })} isPending={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
