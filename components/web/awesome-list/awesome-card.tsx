"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GitFork, Copy } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AwesomeCard = ({ list }: { list: any }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(list.repositoryUrl);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const contributors = list.contributors ? list.contributors.split(",") : [];

  const targetAvatarCount = 30; // 5 baris x 6 kolom
  const displayContributors = [...contributors];

  // Duplikasi avatar jika jumlahnya kurang dari target
  if (displayContributors.length < targetAvatarCount) {
    let currentCount = displayContributors.length;
    let index = 0;
    while (currentCount < targetAvatarCount) {
      displayContributors.push(contributors[index % contributors.length]);
      index++;
      currentCount++;
    }
  }

  return (
    <Card className="w-full border text-white overflow-hidden py-0">
      <div className="flex items-stretch ">
        {" "}
        {/* Avatar Sectio */}
        <div className="relative flex-shrink-0">
          <div className="relative w-40 h-full flex items-center justify-center overflow-hidden">
            {/* Contributors (overflowing row) */}
            <div className="absolute inset-0 flex flex-wrap content-start z-0 space-x-1 space-y-1 px-2">
              {displayContributors.map((contributor: string, index: number) => {
                const contributorName = contributor.trim();
                return (
                  <Avatar key={`${contributorName}-${index}`} className="flex-shrink-0 w-8 h-8 ring-1 ring-gray-600 ring-offset-1 ring-offset-gray-800 hover:ring-blue-400 transition-all duration-200 hover:scale-110">
                    <AvatarImage src={`https://github.com/${contributorName}.png`} alt={contributorName} />
                    <AvatarFallback className="bg-gray-600 text-white text-[10px]">{contributorName.split("").slice(0, 2).join("").toUpperCase()}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            {/* Blur Layer */}
            <div
              className="absolute inset-0 bg-black/30 z-[5]"
              style={{
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(1px)",
              }}
            ></div>
            {/* Owner Avatar (positioned on top) */}
            <Avatar className="w-12 h-12 z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800 absolute">
              <AvatarImage src={`https://github.com/${list.owner}.png`} alt={list.owner} />
              <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                {list.owner
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* Repository Info */}
        <CardContent className="flex-1 flex flex-col justify-center space-y-2 py-4 pl-2">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">{list.name}</h3>
            <p className="text-white text-xs">{list.description}</p>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <div className="flex items-center gap-2 bg-black/30 rounded-md p-2 border border-gray-700 max-w-full">
              <ScrollArea className="w-60 flex-1 whitespace-nowrap">
                <span className="text-gray-300 text-[11px] font-mono whitespace-nowrap">{list.repositoryUrl}</span>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-7 px-2 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-200">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{list.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              <span>{list.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              by
              <span className="text-blue-400 font-medium">{list.owner}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
