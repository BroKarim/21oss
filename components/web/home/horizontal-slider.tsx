"use client";

import { ComponentCard } from "../list-card/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { ChevronLeft, ChevronRight } from "lucide-react";

import React, { useRef } from "react";

interface HorizontalSliderProps {
  //   title: string;
  //   isLoading?: boolean;
  //   viewAllLink?: string;
  //   viewAllUrl?: string;
  //   onViewAll?: () => void;
  className?: string;
  //   totalCount?: number;
  //   isLeaderboard?: boolean;
  //   onVote?: (demoId: number) => Promise<void>;
  //   hideUser?: boolean;
  //   leftSide?: React.ReactNode;
  //   rightSide?: React.ReactNode;
}

export function HorizontalSlider({ className }: HorizontalSliderProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;

    if (!viewport) return;

    const scrollAmount = viewport.clientWidth * 0.75;
    viewport.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Tess</h2>
        {/* <div>{rightSide}</div> */}
        <Button variant="link" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto cursor-pointer">
          <Link href="/" className="flex items-center gap-1 group">
            View All
            <span className="ml-1 text-muted-foreground group-hover:text-foreground">(10)</span>
          </Link>
        </Button>
      </div>

      <div className="relative">
        <ScrollArea ref={scrollAreaRef} className="w-full -mx-1 px-1">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4"
            style={{
              minWidth: "100%",
              paddingLeft: "1px",
              paddingRight: "1px",
            }}
          >
            <div className="min-w-[280px] max-w-[280px]">
              <ComponentCard />
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        <Button variant="outline" size="icon" className={cn("absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md transition-opacity opacity-0 pointer-events-none")} onClick={handleScrollLeft}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" className={cn("absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md transition-opacity opacity-0 pointer-events-none")}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent transition-opacity opacity-0")} />
        <div className={cn("pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent transition-opacity opacity-0")} />
      </div>
    </div>
  );
}
