"use client";

import { useState } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cx } from "@/lib/utils";

type ToolGalleryGroupProps = {
  id: string;
  label: string;
  className?: string;
  tools: ToolMany[];
  showGlowingEffect?: boolean;
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};

export const ToolGalleryGroup = ({ id, label, tools, options, className, showGlowingEffect = true }: ToolGalleryGroupProps) => {
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
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section id={id} className={cx("w-full max-w-full space-y-4 border-[0.75px] relative border-border rounded-[1.5rem] p-1 md:p-2 overflow-hidden", className)}>
      <div className="border-[0.75px] md:rounded-[1.5rem] md:p-4 lg:p-4 overflow-hidden">
        {showGlowingEffect && <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 justify-between gap-2">
          <h2 className="text-2xl ">{label}</h2>
          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>

        <div className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden">
          {displayedTools.map((tool, index) => (
            <div key={tool.id} className="w-full min-w-0 overflow-hidden" style={{ order: index }}>
              <div className="w-full max-w-full overflow-hidden">
                <ToolCard tool={tool} />
              </div>
            </div>
          ))}
        </div>

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
