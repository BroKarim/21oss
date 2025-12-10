"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { StuffTable, type Perk } from "./stuff-table";
import { submitUrl } from "@/config/site";
import { StuffSearch } from "./stuff-search";
import { Button } from "@/components/ui/button-shadcn";
import { AnimatePresence, motion } from "framer-motion";

interface StuffClientWrapperProps {
  initialData: Perk[];
}

export function StuffClientWrapper({ initialData }: StuffClientWrapperProps) {
  const [query] = useQueryState("q", {
    defaultValue: "",
    shallow: true,
    throttleMs: 100,
  });

  const filteredData = useMemo(() => {
    if (!query) return initialData;

    const lowerQuery = query.toLowerCase();
    return initialData.filter((perk) => perk.name.toLowerCase().includes(lowerQuery) || perk.description?.toLowerCase().includes(lowerQuery) || perk.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)));
  }, [query, initialData]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Student Perks</h1>
          <p className="text-muted-foreground">Curated list of free tools and discounts for developers & students.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex-1 md:w-[280px]">
          <StuffSearch />
        </div>

        {/* Submit Button */}
        <Button asChild>
          <a href={submitUrl} target="_blank" rel="noreferrer">
            Submit Resource
          </a>
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {filteredData.length > 0 ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StuffTable data={filteredData} />
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
            <p>No STUFF found for </p>
            <p className="text-sm mt-1">Try searching for something else.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
