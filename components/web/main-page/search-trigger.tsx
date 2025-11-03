"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import { Button } from "@/components/ui/button";
export function SearchTrigger() {
  const search = useSearch();   

  return (
    <Button onClick={search.open} className="relative mb-2 cursor-pointer">
      <Input placeholder="Search..." readOnly className="pr-10 cursor-pointer" />
      <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
    </Button>
  );
}
