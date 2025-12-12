"use client";

import type { Resource } from "@prisma/client";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteResources } from "@/server/admin/resources/actions";

interface ResourcesDeleteDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  resources: Resource[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ResourcesDeleteDialog({ open, onOpenChange, resources, showTrigger = true, onSuccess }: ResourcesDeleteDialogProps) {
  const { execute, isPending } = useServerAction(deleteResources, {
    onSuccess: () => {
      toast.success("Resources deleted successfully");
      onOpenChange?.(false);
      onSuccess?.();
    },
    onError: ({ err }) => {
      toast.error(err.message);
    },
  });

  const handleDelete = () => {
    execute({ ids: resources.map((r) => r.id) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete ({resources.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resources</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-bold">{resources.length}</span> resource(s)? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button size="md" variant="destructive" onClick={handleDelete} disabled={isPending} isPending={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
