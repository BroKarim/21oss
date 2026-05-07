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
  const { push } = useRouter();
  const search = useSearch();
  const [results, setResults] = useState<SearchResultData | undefined>();
  const [defaultTools, setDefaultTools] = useState<ToolSearchItem[]>([]);
  const [query, setQuery] = useDebouncedState("", 500);
  const listRef = useRef<HTMLDivElement>(null);

  const [hoveredTool, setHoveredTool] = useState<ToolSearchItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHover = (item: ToolSearchItem | null) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    if (item) {
      previewTimeoutRef.current = setTimeout(() => {
        setHoveredTool(item);
      }, 200);
    } else {
      setHoveredTool(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

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
    push(path);
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
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} showCloseButton={!isPending} >
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left, // relatif ke container
            y: e.clientY - rect.top,
          });
        }}
        className="relative"
      >
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput placeholder="Type to search..." onValueChange={setQuery} className="pr-10" />
            {isPending && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {hasQuery && !isPending && <CommandEmpty>No results found. Please try a different query.</CommandEmpty>}

          <CommandList ref={listRef} className="no-scrollbar">
            <SearchResults name="Tools" items={displayItems} onItemSelect={navigateTo} getHref={(tool) => tool.websiteUrl || "#"} onHover={handleHover} />
          </CommandList>
        </Command>
        {/* {hoveredTool && (
          <div className="fixed top-4 left-4 z-50 bg-background/90 border rounded-lg p-4 text-xs max-w-md pointer-events-none">
            <p className="font-bold">DEBUG Hovered Tool:</p>
            <p>Name: {hoveredTool.name}</p>
            <p>Tagline: {hoveredTool.tagline || "none"}</p>
            <p>Has screenshots: {hoveredTool.screenshots ? "yes" : "no"}</p>
            <p>Screenshots length: {hoveredTool.screenshots?.length ?? 0}</p>
            <p>First imageUrl: {hoveredTool.screenshots?.[0]?.imageUrl || "TIDAK ADA GAMBAR"}</p>
            {hoveredTool.screenshots?.[0]?.imageUrl && <img src={hoveredTool.screenshots[0].imageUrl} alt="debug" className="mt-2 w-48 h-32 object-cover rounded border" />}
          </div>
        )} */}
        {hoveredTool?.screenshots?.[0]?.imageUrl && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              transform: `translate(${smoothPosition.x + 20}px, ${smoothPosition.y - 140}px)`,
              opacity: hoveredTool ? 1 : 0,
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div className="w-60 h-32 rounded-md border bg-background shadow-2xl overflow-hidden">
              <img src={hoveredTool.screenshots[0].imageUrl} alt={hoveredTool.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </CommandDialog>
  );
};
