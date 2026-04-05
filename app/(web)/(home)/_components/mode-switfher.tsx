"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@mantine/hooks";
import { cn } from "@/lib/utils";

export function ModeSwitfher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();

  const currentTheme = isMounted ? theme ?? "system" : "system";
  const resolvedTheme = currentTheme === "system" ? "light" : currentTheme;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button type="button" aria-label="Toggle theme" onClick={toggleTheme} className={cn("inline-flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
    </button>
  );
}
