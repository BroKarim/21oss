"use client";

import * as React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-shadcn";
import { Icons } from "@/components/web/icons";
type StackItem = {
  id: string;
  name: string;
  slug: string;
  faviconUrl: string | null;
};

interface StackFilterProps {
  stacks: StackItem[];
}

export function StackFilter({ stacks }: StackFilterProps) {
  const [stackParam, setStackParam] = useQueryState("stack", {
    shallow: false,
  });

  const activeStacks = React.useMemo(() => stackParam?.split(",") ?? [], [stackParam]);

  const toggleStack = (slug: string) => {
    const next = activeStacks.includes(slug) ? activeStacks.filter((s) => s !== slug) : [...activeStacks, slug];

    setStackParam(next.length ? next.join(",") : null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="bg-background rounded-lg">
          <Icons.filteStack className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-2">
        <div className="space-y-1 max-h-72 overflow-auto">
          {stacks.map((stack) => {
            const isActive = activeStacks.includes(stack.slug);

            return (
              <button key={stack.id} onClick={() => toggleStack(stack.slug)} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                {stack.faviconUrl && (
                  <div className="relative w-4 h-4 shrink-0">
                    <Image src={stack.faviconUrl} alt={stack.name} fill className="object-contain" />
                  </div>
                )}

                <span className="flex-1 text-left">{stack.name}</span>

                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
