import type { ReactNode } from "react";
import { ToolboxShell } from "@/components/web/toolbox/toolbox-shell";

type ToolboxLayoutProps = {
  children: ReactNode;
};

export default function ToolboxLayout({ children }: ToolboxLayoutProps) {
  return <ToolboxShell>{children}</ToolboxShell>;
}
