"use client";

import type { AwesomeList } from "@prisma/client";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { deleteAwesome } from "@/server/admin/awesome/action";

type AwesomeListDeleteDialogProps = ComponentProps<typeof Dialog> & {
  lists: AwesomeList[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export const AwesomeDeleteDialog = ({ lists, showTrigger = true, onSuccess, ...props }: AwesomeListDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteAwesome, {
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Awesome list deleted");
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
            Delete ({lists.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete <span className="font-medium">{lists.length}</span>
            {lists.length === 1 ? " list" : " lists"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button aria-label="Delete selected rows" size="md" variant="destructive" className="min-w-28" onClick={() => execute({ ids: lists.map(({ id }) => id) })} isPending={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
