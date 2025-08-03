"use client";

import { useState } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";
import { GlowingEffect } from "@/components/ui/glowing-effect";
type ToolGalleryGroupProps = {
  id: string;
  label: string;
  tools: ToolMany[];
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};

export const ToolGalleryGroup = ({ id, label, tools, options }: ToolGalleryGroupProps) => {
  const { showViewAll = false, viewAllUrl, loadMore = false } = options;
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedTools = tools.slice(0, visibleCount);

  if (!displayedTools.length) {
    return (
      <section className="space-y-4" id={id}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{label}</h2>
          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>
        <div className="text-center text-gray-500">No tools available for this section.</div>
      </section>
    );
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3); // Tambah 3 item
  };

  return (
    <section className="space-y-4 border-[0.75px] relative h-full border-border md:rounded-[1.5rem] p-2 rounded-lg md:p-3" id={id}>
      <div className="border-[0.75px] md:rounded-[1.5rem] md:p-6">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="flex items-center mb-2 justify-between">
          <h2 className="text-2xl ">{label}</h2>
          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>

        {/* Grid 3 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
          {displayedTools.map((tool, index) => (
            <div key={tool.id} className="min-w-[350px] max-w-[350px]">
              <ToolCard tool={tool} style={{ order: index }} />
            </div>
          ))}
        </div>

        {/* Tombol Load More */}
        {loadMore && visibleCount < tools.length && (
          <div className="flex justify-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
