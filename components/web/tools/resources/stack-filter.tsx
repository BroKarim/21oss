"use client";

import * as React from "react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

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
  const [activeStack, setActiveStack] = useQueryState("stack", {
    shallow: false,
  });

  const handleSelect = (slug: string) => {
    if (activeStack === slug) {
      setActiveStack(null); // nonaktif → tidak ada filter
    } else {
      setActiveStack(slug);
    }
  };

  return (
    <div className="relative group w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade">
        {stacks.map((stack) => {
          const isActive = activeStack === stack.slug;

          return (
            <button
              key={stack.id}
              onClick={() => handleSelect(stack.slug)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-all whitespace-nowrap",
                isActive ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-foreground border-input hover:bg-muted hover:border-foreground/50"
              )}
            >
              {stack.faviconUrl && (
                <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 bg-white/10">
                  <Image src={stack.faviconUrl} alt={stack.name} fill className="object-contain" />
                </div>
              )}
              <span>{stack.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
