"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ManualFetchTemplatesButton() {
  const [isPending, setIsPending] = useState(false);

  const runFetchTemplates = async () => {
    setIsPending(true);

    try {
      const response = await fetch("/api/cron/fetch-templates", {
        method: "POST",
      });

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
      setIsPending(false);
    }
  };

  return (
    <Button onClick={runFetchTemplates} disabled={isPending}>
      {isPending ? "Running Fetch..." : "Fetch Templates"}
    </Button>
  );
}
