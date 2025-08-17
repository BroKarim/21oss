"use client";

import type { Ad } from "@prisma/client";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteAds } from "@/server/admin/ads/action";
import { Trash } from "lucide-react";

type AdsDeleteDialogProps = ComponentProps<typeof Dialog> & {
  ads: Ad[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export const AdsDeleteDialog = ({ ads, showTrigger = true, onSuccess, ...props }: AdsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteAds, {
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Ads deleted");
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
            Delete ({ads.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your <span className="font-medium">{ads.length}</span>
            {ads.length === 1 ? " ad" : " ads"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button aria-label="Delete selected rows" size="md" variant="destructive" className="min-w-28" onClick={() => execute({ ids: ads.map(({ id }) => id) })} isPending={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
