"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { useQueryState } from "nuqs";

// import { ModeToggle } from "@/components/mode-toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { StackItem } from "../_lib/types";
import { ModeSwitfher } from "./mode-switfher";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: "star",
    param: "featured",
  },
  { label: "Students", href: "/student", icon: "layout", param: null },
];

function NavIcon({ type }: { type: string }) {
  const p = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "zap":
      return (
        <svg {...p}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "layout":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    default:
      return null;
  }
}

const STACK_GROUPS = [
  {
    key: "framework",
    label: "Framework",
    defaultOpen: true,
    keywords: ["react", "nextjs", "next", "vue", "nuxt", "reactnative"],
  },
  {
    key: "css",
    label: "CSS & UI",
    defaultOpen: true,
    keywords: ["css", "css3", "tailwind", "tailwindcss", "postcss", "sass", "scss", "unocss", "radixui", "radix"],
  },
  {
    key: "database",
    label: "Database",
    defaultOpen: false,
    keywords: ["prisma", "drizzle", "postgres", "postgresql", "supabase"],
  },
  {
    key: "auth",
    label: "Auth",
    defaultOpen: false,
    keywords: ["auth", "authentication", "firebase", "supabase", "clerk", "auth0", "nextauth", "jwt"],
  },
  {
    key: "other",
    label: "Other",
    defaultOpen: false,
    keywords: [],
  },
];

const normalizeStackKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function Sidebar({ stacks }: { stacks: StackItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter");
  const stackParam = searchParams.get("stack");
  const [, setStackParam] = useQueryState("stack", {
    shallow: false,
  });
  const activeStacks = useMemo(() => stackParam?.split(",").filter(Boolean) ?? [], [stackParam]);

  const groupedStacks = useMemo(() => {
    const groups = STACK_GROUPS.map((group) => ({
      ...group,
      normalizedKeywords: group.keywords.map(normalizeStackKey),
      items: [] as StackItem[],
    }));

    const otherGroup = groups.find((group) => group.key === "other");

    for (const stack of stacks) {
      const key = normalizeStackKey(stack.slug || stack.name);
      let placed = false;

      for (const group of groups) {
        if (!group.normalizedKeywords.length) continue;
        if (group.normalizedKeywords.some((keyword) => key === keyword || key.includes(keyword))) {
          group.items.push(stack);
          placed = true;
          break;
        }
      }

      if (!placed && otherGroup) {
        otherGroup.items.push(stack);
      }
    }

    return groups;
  }, [stacks]);

  const toggleStack = (slug: string) => {
    const next = activeStacks.includes(slug) ? activeStacks.filter((stack) => stack !== slug) : [...activeStacks, slug];
    if (pathname.startsWith("/student")) {
      const params = new URLSearchParams();
      if (next.length) {
        params.set("stack", next.join(","));
      }
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
      return;
    }
    setStackParam(next.length ? next.join(",") : null);
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="border-border flex h-14 items-center gap-2.5 border-b px-5">
        <div className="relative h-8 w-8 overflow-hidden rounded-lg">
          <Image src="/assets/21-dark.webp" alt="21oss logo" fill className="object-contain" />
        </div>
        <div>
          <span className="md:text-3xl font-bold tracking-tight">21OSS</span>
          {/* <span className="text-muted-foreground text-sm"> OSS</span> */}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="px-3 py-4">
        <p className="text-muted-foreground mb-2 px-2 text-[10px] font-semibold tracking-widest uppercase">Navigation</p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/builder" ? pathname === "/builder" : item.param === null ? pathname === "/home" && !currentFilter : currentFilter === item.param;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                <NavIcon type={item.icon} />
                {item.label}
                {item.param === "newest" && <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">NEW</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="bg-border mx-4 h-px" />

      <div className="flex-1 no-scrollbar overflow-y-auto px-3 py-4">
        <p className="text-muted-foreground mb-2 px-2 text-[10px] font-semibold tracking-widest uppercase">
          Stacks <span className="text-muted-foreground/60 font-normal">({stacks.length})</span>
        </p>
        <div className="space-y-3">
          {groupedStacks.map((group) => (
            <Collapsible key={group.key} defaultOpen={group.defaultOpen}>
              <CollapsibleTrigger asChild>
                <button className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                  <span className="truncate">{group.label}</span>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground/70">{group.items.length}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-0.5">
                {group.items.length ? (
                  group.items.map((stack) => {
                    const isActive = activeStacks.includes(stack.slug);
                    return (
                      <button
                        key={stack.id}
                        onClick={() => toggleStack(stack.slug)}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                          isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {stack.faviconUrl ? (
                          <span className="relative h-4 w-4 shrink-0">
                            <Image src={stack.faviconUrl} alt={stack.name} fill className="object-contain" />
                          </span>
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30 group-hover:bg-primary" />
                        )}
                        <span className="truncate">{stack.name}</span>
                        {isActive && <Check className="ml-auto h-4 w-4" />}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-2.5 py-1.5 text-xs text-muted-foreground/70">Belum ada stack di kategori ini.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <div className="border-border border-t px-5 py-3 flex items-center justify-between">
        <p className="text-muted-foreground/60 text-[11px]">dzenn.gallery © {new Date().getFullYear()}</p>
        <ModeSwitfher />
      </div>
    </aside>
  );
}
