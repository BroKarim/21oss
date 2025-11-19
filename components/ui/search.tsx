"use client";

import { useDebouncedState } from "@mantine/hooks";
import { getUrlHostname } from "@primoui/utils";
import { usePathname, useRouter } from "next/navigation";
import { posthog } from "posthog-js";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { inferServerActionReturnData } from "zsa";
import { useServerAction } from "zsa-react";
import { fetchRepositoryData } from "@/actions/misc";
import { searchItems } from "@/actions/search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useSearch } from "@/contexts/search-context";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

// Gunakan inferServerActionReturnData untuk type-safety
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
        <CommandItem key={`${name}-${item.slug}`} value={`${name.toLowerCase()}:${item.slug}`} onSelect={() => onItemSelect(getHref(item))}>
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
  const pathname = usePathname();
  const search = useSearch();
  const [results, setResults] = useState<SearchResultData | undefined>();
  const [query, setQuery] = useDebouncedState("", 500);
  const listRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user.role === "admin";
  const isAdminPath = pathname.startsWith("/admin");
  const hasQuery = !!query.length;

  const actions = [
    {
      action: fetchRepositoryData,
      label: "Fetch Repository Data",
      successMessage: "Repository data fetched",
    },
  ] as const;

  const adminActions = actions.map(({ label, action, successMessage }) => ({
    label,
    execute: useServerAction(action, {
      onSuccess: () => toast.success(successMessage),
      onError: ({ err }) => toast.error(err.message),
    }).execute,
  }));

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

  // Admin command sections
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

  return (
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} showCloseButton={!isPending}>
      <div className="relative">
        <CommandInput placeholder="Type to search..." onValueChange={setQuery} className="pr-10" />
        {isPending && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {hasQuery && !isPending && <CommandEmpty>No results found. Please try a different query.</CommandEmpty>}

      <CommandList ref={listRef}>
        {!hasQuery &&
          commandSections.map(({ name, items }) => (
            <CommandGroup key={name} heading={name}>
              {items.map(({ path, label }) => (
                <CommandItem key={path} onSelect={() => navigateTo(path)}>
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

        {!hasQuery && isAdmin && (
          <CommandGroup heading="Admin">
            {adminActions.map(({ label, execute }) => (
              <CommandItem key={label} onSelect={() => execute()}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <SearchResults
          name="Tools"
          items={results?.tools}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin/tools" : ""}/${slug}`}
          renderItemDisplay={({ name, faviconUrl, websiteUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
              <span className="opacity-50">{getUrlHostname(websiteUrl ?? "")}</span>
            </>
          )}
        />
      </CommandList>
    </CommandDialog>
  );
};
