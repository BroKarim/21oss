// app/resources/_components/resources-tabs.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs-6";
import { ToolType } from "@prisma/client";
import { useQueryState } from "nuqs";

const TYPES: { label: string; value: ToolType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Templates", value: ToolType.Template },
  { label: "Components", value: ToolType.Component },
  { label: "Assets", value: ToolType.Asset },
];

export function ResourcesTabs({ defaultValue }: { defaultValue: string }) {
  const [type, setType] = useQueryState("type", {
    defaultValue,
    shallow: false,
  });

  return (
    <Tabs value={type} onValueChange={setType}>
      <TabsList variant="pills" className="w-fit mx-auto">
        {TYPES.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="text-neutral-400 text-md">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
