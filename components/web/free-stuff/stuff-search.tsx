"use client";

import { useQueryState } from "nuqs";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input"; 

export function StuffSearch() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    shallow: false, 
    throttleMs: 500, 
  });

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className=" bg-background/60 backdrop-blur-sm border-border/50 focus:bg-background transition-all" />
      {search && (
        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground">
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
