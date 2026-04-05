"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ToolList } from "@/server/web/tools/payloads";
import { ResourceCard } from "@/components/web/tools/resources/resources-card";

type ResourceGridProps = {
  resources: ToolList[];
  title: string;
  description: string;
};

export function ResourceGrid({ resources, title, description }: ResourceGridProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const activeStackSlugs = useMemo(() => {
    const stackParam = searchParams.get("stack");
    return stackParam?.split(",").filter(Boolean) ?? [];
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((tool) => {
      const matchSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query) ||
        (tool.tagline ?? "").toLowerCase().includes(query);

      const matchStack = !activeStackSlugs.length || tool.stacks.some((stack) => activeStackSlugs.includes(stack.slug));

      return matchSearch && matchStack;
    });
  }, [resources, search, activeStackSlugs]);

  return (
    <div className="flex-1">
      <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-xl">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 h-9 w-64 rounded-lg border pr-3 pl-9 text-sm outline-none focus:ring-1"
                />
              </div>
              <span className="text-muted-foreground text-xs tabular-nums">{filtered.length} templates</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2" />
          </div>
        </div>
      </header>

      <div className="p-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 text-sm font-medium">No templates found</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
            {filtered.map((tool) => (
              <ResourceCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
