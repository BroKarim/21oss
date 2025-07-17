import { type ReactNode } from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { cx } from "@/lib/utils";
import { MousePointerClick } from "lucide-react";

type Relation = {
  id: string;
  name: ReactNode;
};

type RelationSelectorProps<T> = {
  relations: T[];
  selectedIds: string[];
  mapFunction?: (relation: T) => Relation;
  sortFunction?: (a: T, b: T) => number;
  setSelectedIds: (selectedIds: string[]) => void;
};

export const RelationSelector = <T extends Relation>({ relations, selectedIds, mapFunction, sortFunction, setSelectedIds }: RelationSelectorProps<T>) => {
  const selectedRelations = relations?.filter(({ id }) => selectedIds.includes(id));

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
            prefix={<MousePointerClick />}
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
                  return (
                    <CommandItem
                      key={relation.id}
                      onSelect={() => {
                        const newSelected = isSelected ? selectedIds.filter((id) => id !== relation.id) : [...selectedIds, relation.id];
                        setSelectedIds(newSelected);
                      }}
                    >
                      <input type="checkbox" checked={isSelected} readOnly className="pointer-events-none" />
                      <Stack wrap={false} className={cx("flex-1 justify-between truncate")}>
                        {relation.name}
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
    </Stack>
  );
};
