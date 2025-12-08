"use client";

import type { DevPerk } from "@prisma/client";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteFreeStuff } from "@/server/admin/free-stuff/actions";
import { Trash } from "lucide-react";

type FreeStuffDeleteDialogProps = ComponentProps<typeof Dialog> & {
  items: DevPerk[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export const FreeStuffDeleteDialog = ({ items, showTrigger = true, onSuccess, ...props }: FreeStuffDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteFreeStuff, {
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Items deleted");
      onSuccess?.();
    },
    onError: ({ err }) => toast.error(err.message),
  });

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md" prefix={<Trash />}>
            Delete ({items.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your <span className="font-medium">{items.length}</span>
            {items.length === 1 ? " item" : " items"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() =>
              execute({
                ids: items.map(({ id }) => id),
              })
            }
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
