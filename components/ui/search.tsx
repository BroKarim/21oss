"use client";

import { useDebouncedState } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { posthog } from "posthog-js";
import { type ReactNode, useEffect, useRef, useState } from "react";

import type { inferServerActionReturnData } from "zsa";
import { useServerAction } from "zsa-react";

import { searchItems, getRandomTools } from "@/actions/search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command";
import { useSearch } from "@/contexts/search-context";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

type SearchResultData = inferServerActionReturnData<typeof searchItems>;
type ToolSearchItem = SearchResultData["tools"][number];

type SearchResultsProps = {
  name: string;
  items: ToolSearchItem[] | undefined;
  onItemSelect: (url: string) => void;
  getHref: (item: ToolSearchItem) => string;
  renderItemDisplay: (item: ToolSearchItem) => ReactNode;
};

const SearchResults = ({ name, items, onItemSelect, getHref, renderItemDisplay }: SearchResultsProps) => {
  if (!items?.length) return null;

  return (
    <CommandGroup heading={name}>
      {items.map((item) => (
        <CommandItem key={`${name}-${item.websiteUrl}`} value={`${item.name} ${item.tagline || ""}`} onSelect={() => onItemSelect(getHref(item))}>
          {renderItemDisplay(item)}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

type CommandSection = {
  name: string;
  items: {
    label: string;
    path: string;
  }[];
};

export const Search = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const search = useSearch();
  const [results, setResults] = useState<SearchResultData | undefined>();
  const [defaultTools, setDefaultTools] = useState<ToolSearchItem[]>([]);
  const [query, setQuery] = useDebouncedState("", 500);
  const listRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user.role === "admin";
  const hasQuery = !!query.length;

  const { execute: fetchDefaultTools } = useServerAction(getRandomTools, {
    onSuccess: ({ data }) => {
      setDefaultTools(data.tools);
    },
  });

  useEffect(() => {
    if (search.isOpen && defaultTools.length === 0) {
      fetchDefaultTools();
    }
  }, [search.isOpen, defaultTools.length, fetchDefaultTools]);

  const clearSearch = () => {
    setTimeout(() => {
      setResults(undefined);
      setQuery("");
    }, 250);
  };

  const handleOpenChange = (open: boolean) => {
    open ? search.open() : search.close();
    if (!open) clearSearch();
  };

  const navigateTo = (path: string) => {
    router.push(path);
    handleOpenChange(false);
  };

  const commandSections: CommandSection[] = [];

  if (isAdmin) {
    commandSections.push({
      name: "Create",
      items: [
        {
          label: "New Tool",
          path: "/admin/tools/new",
        },
        {
          label: "New Alternative",
          path: "/admin/alternatives/new",
        },
        {
          label: "New Category",
          path: "/admin/categories/new",
        },
      ],
    });
  }

  const { execute, isPending } = useServerAction(searchItems, {
    onSuccess: ({ data }) => {
      setResults(data);

      const q = query.toLowerCase().trim();

      if (q.length > 1) {
        posthog.capture("search", { query: q });
      }
    },

    onError: ({ err }) => {
      console.error(err);
      setResults(undefined);
    },
  });

  useEffect(() => {
    const performSearch = async () => {
      if (hasQuery) {
        execute({ query });
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setResults(undefined);
      }
    };

    performSearch();
  }, [query, execute, hasQuery]);

  const displayItems = hasQuery ? results?.tools : defaultTools;

  return (
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} showCloseButton={!isPending}>
      <Command shouldFilter={false}>
        <div className="relative">
          <CommandInput placeholder="Type to search..." onValueChange={setQuery} className="pr-10" />
          {isPending && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {hasQuery && !isPending && <CommandEmpty>No results found. Please try a different query.</CommandEmpty>}

        <CommandList ref={listRef}>
          <SearchResults
            name="Tools"
            items={displayItems}
            onItemSelect={navigateTo}
            getHref={(tool) => tool.websiteUrl || "#"}
            renderItemDisplay={(tool) => (
              <CommandItem key={tool.id} value={`${tool.name} ${tool.tagline || ""}`} onSelect={() => navigateTo(tool.websiteUrl || "#")}>
                <div className="flex items-center gap-3 w-full relative">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tool.name}</div>
                    {tool.tagline && <div className="text-xs text-muted-foreground truncate">{tool.tagline}</div>}
                  </div>

                  {tool.screenshots[0]?.imageUrl && (
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 pointer-events-none">
                      <div className="bg-background border rounded-lg shadow-xl p-2">
                        <img src={tool.screenshots[0].imageUrl} alt={tool.name} className="w-64 h-auto rounded" />
                      </div>
                    </div>
                  )}
                </div>
              </CommandItem>
            )}
          />
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
