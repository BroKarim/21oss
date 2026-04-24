"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchAllToolRepositoryData } from "@/server/admin/tools/actions";

export function ToolsMaintenanceMenu() {
  const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);

  const fetchRepos = useServerAction(fetchAllToolRepositoryData, {
    onSuccess: () => toast.success("✅ All tool repositories data fetched successfully."),
    onError: ({ err }) => toast.error(`❌ ${err.message}`),
  });

  const runFetchTemplates = async () => {
    setIsFetchingTemplates(true);
    try {
      const response = await fetch("/api/cron/fetch-templates", { method: "POST" });
      const data = (await response.json()) as
        | { success: true; total: number; inserted: number; skipped: number }
        | { error?: string };

      if (!response.ok || !("success" in data)) {
        const message = "error" in data ? (data.error ?? "Failed to run fetch templates") : "Failed to run fetch templates";
        throw new Error(message);
      }

      toast.success(`Fetch selesai. total=${data.total}, inserted=${data.inserted}, skipped=${data.skipped}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed: ${message}`);
    } finally {
      setIsFetchingTemplates(false);
    }
  };

  const disabled = isFetchingTemplates || fetchRepos.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" prefix={<Wrench />} disabled={disabled}>
          Maintenance
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={disabled} onSelect={() => void runFetchTemplates()}>
          Fetch Templates
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled={disabled} onSelect={() => fetchRepos.execute({})}>
          Fetch Repo Data (All)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

