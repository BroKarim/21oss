// app/resources/_components/resources-filters.tsx
"use client";

import { useQueryState } from "nuqs";
import { StackCombobox } from "@/app/admin/tools/_components/stack-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORT_OPTIONS = [
  { label: "Most Stars", value: "stars" },
  { label: "Most Forks", value: "forks" },
  { label: "Newest Update", value: "newest" },
  { label: "Oldest Repo", value: "oldest" },
];

export function ResourcesFilters({ stackOptions }: { stackOptions: any[] }) {
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "stars",
    shallow: false,
  });

  const [stack, setStack] = useQueryState("stack", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <StackCombobox options={stackOptions} onSelect={(stackObj) => setStack(stackObj?.slug || "")} />
    </div>
  );
}
