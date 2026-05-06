"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Sparkles } from "lucide-react";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { backfillTemplateSearchMetadata, initializeMeiliIndex, reindexTemplatesToSearch } from "@/server/admin/search/actions";

export function SearchOpsMenu() {
  const [isBusy, setIsBusy] = useState(false);

  const initMeili = useServerAction(initializeMeiliIndex, {
    onSuccess: ({ data }) => {
      toast.success(`Meili initialized. task=${data.taskUid}`);
      setIsBusy(false);
    },
    onError: ({ err }) => {
      toast.error(`Init failed: ${err.message}`);
      setIsBusy(false);
    },
  });

  const enrichBackfill = useServerAction(backfillTemplateSearchMetadata, {
    onSuccess: ({ data }) => {
      toast.success(`Enrich done. total=${data.total}, refreshed=${data.refreshed}`);
      setIsBusy(false);
    },
    onError: ({ err }) => {
      toast.error(`Enrich failed: ${err.message}`);
      setIsBusy(false);
    },
  });

  const reindex = useServerAction(reindexTemplatesToSearch, {
    onSuccess: ({ data }) => {
      toast.success(`Reindex done. indexed=${data.documents.length}, refreshed=${data.refreshed}`);
      setIsBusy(false);
    },
    onError: ({ err }) => {
      toast.error(`Reindex failed: ${err.message}`);
      setIsBusy(false);
    },
  });

  const disabled = isBusy || initMeili.isPending || enrichBackfill.isPending || reindex.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" prefix={<Search />} disabled={disabled}>
          Search Ops
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            setIsBusy(true);
            initMeili.execute({});
          }}
        >
          Init Meili Index
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            setIsBusy(true);
            enrichBackfill.execute({ take: 50 });
          }}
        >
          <Sparkles className="mr-2 size-4" />
          Enrich Backfill (50)
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            setIsBusy(true);
            reindex.execute({ take: 50, force: false });
          }}
        >
          Reindex Templates (50)
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            setIsBusy(true);
            reindex.execute({ take: 50, force: true });
          }}
        >
          Force Reindex + Re-enrich
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
