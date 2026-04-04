"use client"

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@primoui/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowCheckbox } from "@/components/admin/row-checkbox";
import { useServerAction } from "zsa-react";
import { resetTweetedTools } from "@/server/admin/tweets/actions";

type TweetedTool = {
  id: string;
  name: string;
  slug: string;
  stars: number;
  updatedAt: Date;
  stacks: { name: string; slug: string }[];
};

export function TweetedToolsTable({ tools }: { tools: TweetedTool[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { execute, isPending } = useServerAction(resetTweetedTools, {
    onSuccess: ({ data }) => {
      toast.success(`Removed ${data.updated} tools from tweeted list`);
      setSelectedIds([]);
      router.refresh();
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const allSelected = useMemo(() => tools.length > 0 && selectedIds.length === tools.length, [selectedIds.length, tools.length]);
  const hasSelection = selectedIds.length > 0;

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? tools.map((tool) => tool.id) : []);
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id)));
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-base font-semibold">Tweeted Tools</h2>
          <p className="text-sm text-muted-foreground">Tools that already have tweet drafts.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{tools.length} items</span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={!hasSelection || isPending}
            onClick={() => execute({ ids: selectedIds })}
          >
            Remove Selected
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium">
                <RowCheckbox
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = !allSelected && selectedIds.length > 0;
                    }
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Stacks</th>
              <th className="px-4 py-2 text-left font-medium">Stars</th>
              <th className="px-4 py-2 text-left font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No tweeted tools yet.
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <RowCheckbox
                      checked={selectedIds.includes(tool.id)}
                      onChange={(e) => toggleOne(tool.id, e.target.checked)}
                      aria-label={`Select ${tool.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {tool.stacks.slice(0, 3).map((stack) => (
                        <Badge key={stack.slug} variant="outline">
                          {stack.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{tool.stars.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatDate(tool.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
