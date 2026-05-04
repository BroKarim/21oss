import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";

type ToolboxShellProps = {
  children: ReactNode;
};

const TOOLBOX_NAV_ITEMS = [
  {
    label: "Templates",
    href: "/",
  },
  {
    label: "Students",
    href: "/student",
  },
];

export function ToolboxShell({ children }: ToolboxShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background [scrollbar-gutter:stable_both-edges]">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Logo className="shrink-0" />

          <nav className="flex items-center gap-5 text-sm">
            {TOOLBOX_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} exact={item.href === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="overflow-x-hidden">{children}</main>
    </div>
  );
}
