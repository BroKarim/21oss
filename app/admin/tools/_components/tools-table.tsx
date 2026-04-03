"use client";

import { type Tool, ToolStatus } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { use, useMemo, useState } from "react";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/hooks/use-data-table";
import type { findTools } from "@/server/admin/tools/queries";
import { toolsTableParamsSchema } from "@/server/admin/tools/schema";
import type { DataTableFilterField } from "@/types";
import { getColumns } from "./tools-table-columns";
import { ToolsTableToolbarActions } from "./tools-table-toolbar-actions";
import { Brain, Circle, CircleDashed, ChevronDown, Plus } from "lucide-react";
import { FetchButton } from "@/components/admin/fetch-button";
import { batchAutoFillDraftTools, fetchAllToolRepositoryData } from "@/server/admin/tools/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { DEFAULT_AI_MODELS } from "@/app/admin/_components/ai-model-selector";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// AI Draft Fill Button — modal-free, with inline model selector
// ---------------------------------------------------------------------------

function AIDraftFillButton({ draftCount }: { draftCount: number }) {
  const [model, setModel] = useState("anthropic/claude-sonnet-4.5");
  const [isModelOpen, setIsModelOpen] = useState(false);


  const { execute, isPending } = useServerAction(batchAutoFillDraftTools, {
    onSuccess: ({ data }) => {
      toast.success(
        `✅ AI fill done — ${data.success} berhasil${data.errors > 0 ? `, ${data.errors} gagal` : ""}`,
      );
    },
    onError: ({ err }) => toast.error(`❌ ${err.message}`),
  });

  if (draftCount === 0) return null;

  return (
    <div className="relative flex items-center">
      <div className="inline-flex -space-x-px divide-x divide-border rounded-lg shadow-sm rtl:space-x-reverse">
        {/* Main action button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          className="rounded-r-none gap-1.5"
          onClick={() => execute({ model })}
        >
          <Brain className="w-3.5 h-3.5" />
          {isPending ? "Filling..." : `AI Fill ${draftCount} Drafts`}
        </Button>

        {/* Model picker dropdown */}
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-l-none px-2"
            onClick={() => setIsModelOpen((v) => !v)}
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isModelOpen && "rotate-180")} />
          </Button>

          {isModelOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-border bg-popover p-1 shadow-lg">
              {DEFAULT_AI_MODELS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => {
                    setModel(m.value);
                    setIsModelOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    model === m.value ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  <m.icon className="h-3.5 w-3.5 shrink-0" />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Table
// ---------------------------------------------------------------------------

type ToolsTableProps = {
  toolsPromise: ReturnType<typeof findTools>;
};

export function ToolsTable({ toolsPromise }: ToolsTableProps) {
  const { tools, toolsTotal, pageCount } = use(toolsPromise);
  const [{ perPage, sort }] = useQueryStates(toolsTableParamsSchema);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);

  // Count Draft tools for the AI fill button label
  const draftCount = useMemo(() => tools.filter((t) => t.status === ToolStatus.Draft).length, [tools]);

  // Search filters
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
    {
      id: "status",
      label: "Status",
      options: [
        {
          label: "Published",
          value: ToolStatus.Published,
          icon: <Circle className="text-green-500" />,
        },
        {
          label: "Draft",
          value: ToolStatus.Draft,
          icon: <CircleDashed className="text-gray-500" />,
        },
      ],
    },
  ];

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnVisibility: { submitterEmail: false, createdAt: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <DataTable table={table} className="min-w-[1100px] table-fixed">
      <DataTableHeader
        title="Tools"
        total={toolsTotal}
        callToAction={
          <Button variant="primary" size="md" prefix={<Plus />} asChild>
            <Link href="/admin/tools/new">
              <div className="max-sm:sr-only">New tool</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ToolsTableToolbarActions table={table} />
          <AIDraftFillButton draftCount={draftCount} />
          <FetchButton action={fetchAllToolRepositoryData} buttonText="Fetch Tool Repository Data" successMessage="✅ All tool repositories data fetched successfully." className="w-fit" />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  );
}
