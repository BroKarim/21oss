// app/resources/resource-tabs.tsx
"use client";

import { useTransition, useState } from "react";
import { ToolType } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs-6";
import { getResources } from "@/server/web/tools/actions";
import { ResourceCard } from "@/components/web/tools/resources/resources-card";

const TYPES: { label: string; value: ToolType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Templates", value: ToolType.Template },
  { label: "Components", value: ToolType.Component },
  { label: "Assets", value: ToolType.Asset },
];

export default function ResourceTabs({ initialResources }: { initialResources: any[] }) {
  const [resources, setResources] = useState(initialResources);
  const [isPending, startTransition] = useTransition();

  const onChange = (value: string) => {
    // Terima parameter value dari onValueChange
    startTransition(async () => {
      const data = await getResources(value as ToolType | "all"); // Kirim type ke getResources
      setResources(data);
    });
  };
  return (
    <div className="w-full mx-auto mt-12 space-y-12">
      <Tabs defaultValue="all" onValueChange={onChange}>
        <TabsList variant="pills" className="w-fit mx-auto">
          {TYPES.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((tool) => (
          <ResourceCard key={tool.id} tool={tool} />
        ))}
      </div>

      {isPending && <div className="text-center text-sm text-muted-foreground">Loading…</div>}
    </div>
  );
}
