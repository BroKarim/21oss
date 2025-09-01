"use client";

import type { AwesomeList } from "@prisma/client";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { deleteAwesome } from "@/server/admin/awesome-list/actions";

type AwesomeListDeleteDialogProps = ComponentProps<typeof Dialog> & {
  awesomes: AwesomeList[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export const AwesomeDeleteDialog = ({ awesomes, showTrigger = true, onSuccess, ...props }: AwesomeListDeleteDialogProps) => {
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
            Delete ({awesomes.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete <span className="font-medium">{awesomes.length}</span>
            {awesomes.length === 1 ? " list" : " awesome"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button aria-label="Delete selected rows" size="md" variant="destructive" className="min-w-28" onClick={() => execute({ ids: awesomes.map(({ id }) => id) })} isPending={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
