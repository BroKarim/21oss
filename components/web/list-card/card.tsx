"use client";

import { GitFork, Star } from "lucide-react";

import { ComponentCardSkeleton } from "@/components/ui/skeletons";

import ComponentPreviewImage from "./card-image";

export function ComponentCard({ isLoading }: { isLoading?: boolean; hideUser?: boolean; onClick?: () => void; onCtrlClick?: (url: string) => void; hideVotes?: boolean; isLeaderboard?: boolean; onVote?: (demoId: number) => Promise<void> }) {
  if (isLoading) {
    return <ComponentCardSkeleton />;
  }

  return (
    <div className="block select-none">
      <div className="relative aspect-[4/3] mb-3 group">
        <div className="absolute inset-0">
          <div className="relative w-full h-full rounded-lg shadow-base overflow-hidden">
            <div className="absolute inset-0">
              <ComponentPreviewImage
                src="https://images.unsplash.com/photo-1750779940698-f24b28d76fd9?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="tes"
                fallbackSrc="/placeholder.svg"
                className="rounded-lg"
              />
            </div>
            <div className="absolute inset-0 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="flex space-x-3 items-center">
        <div className="flex items-center justify-between flex-grow min-w-0">
          <div className="block min-w-0 flex-1 mr-3">
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-medium text-foreground truncate">Tess card</h2>
            </div>
          </div>
          {/* TODO : GANTI GITHUB KET */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap shrink-0 gap-1">
              <Star size={14} />
              <span>10</span>
            </div>

            <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap shrink-0 gap-1">
              <GitFork size={14} className="text-muted-foreground" />
              <span>40</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
