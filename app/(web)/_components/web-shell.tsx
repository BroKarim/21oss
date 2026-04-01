import type { ReactNode } from "react";
import { Sidebar } from "../(home)/_components/sidebar";
import type { StackItem } from "../(home)/_lib/types";

type WebShellProps = {
  stacks: StackItem[];
  children: ReactNode;
};

export function WebShell({ stacks, children }: WebShellProps) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar stacks={stacks} />
      <main className="ml-[260px] flex-1">{children}</main>
    </div>
  );
}
