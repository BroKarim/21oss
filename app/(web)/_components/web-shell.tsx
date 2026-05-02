import { Suspense, type ReactNode } from "react";
import { Sidebar } from "../(home)/_components/sidebar";
import type { StackItem } from "../(home)/_lib/types";
import { FiltersProvider } from "@/contexts/filter-context";

type WebShellProps = {
  stacks: StackItem[];
  children: ReactNode;
};

export function WebShell({ stacks, children }: WebShellProps) {
  return (
    <FiltersProvider enableFilters>
      <div className="bg-background flex min-h-screen">
        <Suspense fallback={<aside className="h-screen w-[260px] shrink-0 border-r border-border bg-background" />}>
          <Sidebar stacks={stacks} />
        </Suspense>
        <main className="ml-[260px] flex-1">{children}</main>
      </div>
    </FiltersProvider>
  );
}
