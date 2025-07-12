import { useCompletion } from "@ai-sdk/react";
import { isTruthy } from "@primoui/utils";
import { type ReactNode, useEffect, useState } from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { cx } from "@/lib/utils";

type Relation = {
  id: string;
  name: ReactNode;
};

type RelationSelectorProps<T> = {
  relations: T[];
  selectedIds: string[];
  prompt?: string;
  maxSuggestions?: number;
  suggestedIds?: string[];
  mapFunction?: (relation: T) => Relation;
  sortFunction?: (a: T, b: T) => number;
  setSelectedIds: (selectedIds: string[]) => void;
};

export const RelationSelector = <T extends Relation>({ relations, selectedIds, prompt, maxSuggestions = 5, suggestedIds, mapFunction, sortFunction, setSelectedIds }: RelationSelectorProps<T>) => {
  const suggestRelations = suggestedIds ? relations.filter((r) => suggestedIds.includes(r.id)) : [];
  const [suggestedRelations, setSuggestedRelations] = useState<T[]>(suggestRelations);
  const selectedRelations = relations?.filter(({ id }) => selectedIds.includes(id));

  const { complete } = useCompletion({
    api: "/api/ai/completion",
    experimental_throttle: 1000,

    onFinish: (_, completion) => {
      if (completion) {
        const suggestions = completion
          .split(",")
          .map((name) => name.trim())
          .map((name) => relations.find((c) => c.name === name) || null)
          .filter((name, index, self) => self.indexOf(name) === index)
          .filter(isTruthy)
          .slice(0, maxSuggestions);

        setSuggestedRelations(suggestions);
      }
    },
  });

  useEffect(() => {
    if (prompt && !!relations.length && !selectedIds.length && !suggestedRelations.length) {
      complete(`${prompt}
        
        Only return the relation names in comma-separated format, and nothing else. If there are no relevant relations, return an empty string.
        Sort the relations by relevance to the link.
        Suggest only ${maxSuggestions} relations at most.

        Available relations: ${relations.map(({ name }) => name).join(", ")}
      `);
    }
  }, [prompt, selectedIds]);

  const handleFilter = (value: string, search: string) => {
    const normalizedValue = value.toLowerCase();
    const normalizedSearch = search.toLowerCase();
    return normalizedValue.includes(normalizedSearch) ? 1 : 0;
  };

  const getDisplayRelations = (relations: T[], sort = false): Relation[] => {
    const sortedRelations = sort && sortFunction ? [...relations].sort(sortFunction) : relations;
    return sortedRelations.map((relation) => (mapFunction ? mapFunction(relation) : relation));
  };

  return (
    <Stack direction="column" className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className="justify-start w-full px-3 gap-2.5"
            prefix={<Icon name="lucide/mouse-pointer-click" />}
            suffix={
              <Badge variant="outline" className="ml-auto size-auto">
                {selectedRelations.length}
              </Badge>
            }
          >
            <Separator orientation="vertical" className="self-stretch" />

            <AnimatedContainer height transition={{ ease: "linear", duration: 0.1 }}>
              <Stack size="xs">
                {!selectedRelations.length && <span className="font-normal text-muted-foreground">Select</span>}

                {getDisplayRelations(selectedRelations).map((relation) => (
                  <Badge key={relation.id}>{relation.name}</Badge>
                ))}
              </Stack>
            </AnimatedContainer>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Command filter={handleFilter}>
            <CommandInput placeholder="Search..." />

            <CommandList className="min-w-72 w-(--radix-popper-anchor-width)">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {getDisplayRelations(relations, true).map((relation) => {
                  const isSelected = selectedIds.includes(relation.id);
                  const isSuggested = suggestedRelations.find((r) => r.id === relation.id);

                  return (
                    <CommandItem
                      key={relation.id}
                      onSelect={() => {
                        const newSelected = isSelected ? selectedIds.filter((id) => id !== relation.id) : [...selectedIds, relation.id];
                        setSelectedIds(newSelected);
                        setSuggestedRelations((rel) => rel.filter(({ id }) => id !== relation.id));
                      }}
                    >
                      <input type="checkbox" checked={isSelected} readOnly className="pointer-events-none" />

                      <Stack wrap={false} className={cx("flex-1 justify-between truncate", isSuggested && "font-medium text-orange-800 dark:text-orange-200")}>
                        {relation.name}
                        {isSuggested && <Icon name="lucide/sparkles" />}
                      </Stack>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {!!selectedIds.length && (
                <div className="p-1 border-t sticky -bottom-px bg-background">
                  <Button size="md" variant="ghost" onClick={() => setSelectedIds([])} className="w-full">
                    Clear selection
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(suggestedRelations.length || prompt) && (
        <AnimatedContainer height transition={{ ease: "linear", duration: 0.1 }}>
          {!!suggestedRelations.length && (
            <Stack direction="column" className="items-start">
              <span className="mt-px text-xs text-muted-foreground">Suggested:</span>

              <Stack size="xs" className="flex-1">
                {getDisplayRelations(suggestedRelations).map((relation) => (
                  <Badge key={relation.id} variant="destructive" asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIds(selectedIds.concat(relation.id));
                        setSuggestedRelations((rel) => rel.filter(({ id }) => id !== relation.id));
                      }}
                    >
                      {relation.name}
                    </button>
                  </Badge>
                ))}
              </Stack>
            </Stack>
          )}
        </AnimatedContainer>
      )}
    </Stack>
  );
};
