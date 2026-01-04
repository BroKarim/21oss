"use client";

import { useDebouncedState } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { posthog } from "posthog-js";
import { useEffect, useRef, useState } from "react";

import type { inferServerActionReturnData } from "zsa";
import { useServerAction } from "zsa-react";

import { searchItems, getRandomTools } from "@/actions/search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command";
import { useSearch } from "@/contexts/search-context";
import { Loader2 } from "lucide-react";

type SearchResultData = inferServerActionReturnData<typeof searchItems>;
type ToolSearchItem = SearchResultData["tools"][number];

type SearchResultsProps = {
  name: string;
  items: ToolSearchItem[] | undefined;
  onItemSelect: (url: string) => void;
  getHref: (item: ToolSearchItem) => string;
  onHover: (item: ToolSearchItem | null) => void;
};

const SearchResults = ({ name, items, onItemSelect, getHref, onHover }: SearchResultsProps) => {
  if (!items?.length) return null;

  return (
    <CommandGroup heading={name}>
      {items.map((item) => (
        <CommandItem key={`${name}-${item.websiteUrl}`} value={`${item.name} ${item.tagline || ""}`} onSelect={() => onItemSelect(getHref(item))} onMouseEnter={() => onHover(item)} onMouseLeave={() => onHover(null)}>
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{item.name}</span>
            {item.tagline && <span className="text-xs text-muted-foreground truncate">{item.tagline}</span>}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export const Search = () => {
  const router = useRouter();
  const search = useSearch();
  const [results, setResults] = useState<SearchResultData | undefined>();
  const [defaultTools, setDefaultTools] = useState<ToolSearchItem[]>([]);
  const [query, setQuery] = useDebouncedState("", 500);
  const listRef = useRef<HTMLDivElement>(null);

  const [hoveredTool, setHoveredTool] = useState<ToolSearchItem | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [showPreview, setShowPreview] = useState(false);

  // ✅ Update onHover handler
  const handleHover = (item: ToolSearchItem | null) => {
    setHoveredTool(item);
    setShowPreview(!!item);
  };

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
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          setMouse({ x: e.clientX, y: e.clientY });
        }}
        className="relative"
      >
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput placeholder="Type to search..." onValueChange={setQuery} className="pr-10" />
            {isPending && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {hasQuery && !isPending && <CommandEmpty>No results found. Please try a different query.</CommandEmpty>}

          <CommandList ref={listRef}>
            <SearchResults name="Tools" items={displayItems} onItemSelect={navigateTo} getHref={(tool) => tool.websiteUrl || "#"} onHover={handleHover} />
          </CommandList>
        </Command>
        {hoveredTool?.screenshots?.[0]?.imageUrl && (
          <div
            className={`fixed z-50 pointer-events-none transition-opacity duration-200 ${showPreview ? "opacity-100" : "opacity-0"}`}
            style={{
              left: mouse.x + 20,
              top: mouse.y - 120,
            }}
          >
            <div className="w-64 rounded-xl border bg-background shadow-xl">
              <img src={hoveredTool.screenshots[0].imageUrl} alt={hoveredTool.name} className="w-full h-auto object-cover" />
            </div>
          </div>
        )}
      </div>
    </CommandDialog>
  );
};
