"use client";

import { GitFork, Star, Timer } from "lucide-react";
import { ComponentCardSkeleton } from "@/components/ui/skeletons";
import { Insights } from "@/components/ui/insights";
import ComponentPreviewImage from "./card-image";

export function ComponentCard({ isLoading }: { isLoading?: boolean; hideUser?: boolean; onClick?: () => void; onCtrlClick?: (url: string) => void; hideVotes?: boolean; isLeaderboard?: boolean; onVote?: (demoId: number) => Promise<void> }) {
  if (isLoading) {
    return <ComponentCardSkeleton />;
  }
  const insights = [
    {
      label: "Stars",
      value: 150,
      icon: <Star />,
    },
    {
      label: "Forks",
      value: 150,
      icon: <GitFork />,
    },
    { label: "Last commit", value: 120, icon: <Timer /> },
  ];

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
                className="rounded-t-lg"
              />
            </div>
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center flex-col justify-center p-4">
              <p className="text-white text-sm text-center leading-relaxed">Lorem Ipsum is simply dummy text </p>
              <Insights insights={insights.filter((i) => i.value)} className="mt-auto" />
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
        </div>
      </div>
    </div>
  );
}
