"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ToolsBySubcategoryLazy from "@/components/web/tools/subcategories/subcategories-query";
// import { type Subcategory } from "@/server/web/categories/queries"; 
interface SubcategoryListContainerProps {
  subcategories: any[]; 
}

export default function SubcategoryListContainer({ subcategories }: SubcategoryListContainerProps) {
  const [stack, setStack] = useState<string | undefined>();
  const [license, setLicense] = useState<string | undefined>();
  const [platform, setPlatform] = useState<string | undefined>();

  const resetFilters = () => {
    setStack(undefined);
    setLicense(undefined);
    setPlatform(undefined);
  };

  return (
    <div className="space-y-6">
      
      <div className="p-4 border rounded-lg ">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Filters:</span>
          <Select value={stack || ""} onValueChange={(v) => setStack(v === "all" ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Stack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stacks</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">Typescripy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={license || ""} onValueChange={(v) => setLicense(v === "all" ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="License" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Licenses</SelectItem>
              {/* Tambahkan item lain di sini jika perlu */}
            </SelectContent>
          </Select>

          <Select value={platform || ""} onValueChange={(v) => setPlatform(v === "all" ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {/* Tambahkan item lain di sini jika perlu */}
            </SelectContent>
          </Select>

          {(stack || license || platform) && (
            <button onClick={resetFilters} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* DAFTAR SUBKATEGORI */}
      <div className="space-y-8">
        {subcategories.map((sub) => (
          <section key={sub.slug} id={sub.slug} className="scroll-mt-24 space-y-4">
            <ToolsBySubcategoryLazy
              subcategorySlug={sub.slug}
              subcategoryLabel={sub.name}
              // Teruskan state filter sebagai props
              stack={stack}
              license={license}
              platform={platform}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
