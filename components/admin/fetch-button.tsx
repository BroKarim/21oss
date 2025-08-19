"use client";

import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAllToolRepositoryData } from "@/server/admin/tools/actions";

export function FetchButton() {
  const fetchAll = useServerAction(fetchAllToolRepositoryData, {
    onSuccess: () => toast.success("✅ All repositories data fetched successfully"),
    onError: ({ err }) => toast.error(`❌ ${err.message}`),
  });

  return (
    <Button onClick={() => fetchAll.execute({})} disabled={fetchAll.isPending} className="w-fit">
      {fetchAll.isPending ? "Fetching..." : "Fetch All Repository Data"}
    </Button>
  );
}
