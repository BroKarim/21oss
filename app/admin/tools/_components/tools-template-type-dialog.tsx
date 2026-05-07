"use client";

import { TemplateType, ToolType, type Tool } from "@prisma/client";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedTabs } from "@/components/web/animated-tabs";
import { bulkSetTemplateType } from "@/server/admin/tools/actions";

type ToolsTemplateTypeDialogProps = ComponentProps<typeof Dialog> & {
  tools: Tool[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

type TabValue = "unspecified" | TemplateType;

export function ToolsTemplateTypeDialog({ tools, showTrigger = true, onSuccess, ...props }: ToolsTemplateTypeDialogProps) {
  const { refresh } = useRouter();
  const [value, setValue] = useState<TabValue>(TemplateType.Website);

  const templateTools = useMemo(() => tools.filter((t) => t.type === ToolType.Template), [tools]);
  const nonTemplateCount = tools.length - templateTools.length;

  const { execute, isPending } = useServerAction(bulkSetTemplateType, {
    onSuccess: ({ data }) => {
      props.onOpenChange?.(false);
      toast.success(`Updated ${data.updated} tools${data.skipped ? `, skipped ${data.skipped}` : ""}`);
      onSuccess?.();
      refresh();
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const nextValue: TemplateType | null = value === "unspecified" ? null : value;

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md">
            Template Category ({tools.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change template category</DialogTitle>
          <DialogDescription>
            Applies only to tools with <span className="font-medium">type=Template</span>. Selected:{" "}
            <span className="font-medium">{tools.length}</span>
            {nonTemplateCount ? (
              <>
                {" "}
                (skips <span className="font-medium">{nonTemplateCount}</span> non-template)
              </>
            ) : null}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <AnimatedTabs
            tabs={[
              { label: "Unset", value: "unspecified" },
              { label: "Website", value: TemplateType.Website },
              { label: "Mobile", value: TemplateType.Mobile },
              { label: "Dashboard", value: TemplateType.Dashboard },
            ]}
            value={value}
            onValueChange={(v) => setValue(v as TabValue)}
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="md"
            variant="primary"
            className="min-w-28"
            isPending={isPending}
            disabled={templateTools.length === 0}
            onClick={() => execute({ ids: templateTools.map((t) => t.id), templateType: nextValue })}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
