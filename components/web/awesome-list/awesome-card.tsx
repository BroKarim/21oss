"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GitFork, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AwesomeCard = ({ list }: { list: any }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(list.repositoryUrl);
      setCopied(true);

      // reset ke icon Copy setelah 2 detik
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const contributors = list.contributors ? list.contributors.split(",") : [];

  const targetAvatarCount = 30;
  const displayContributors = [...contributors];

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
    <Card className="w-full text-white overflow-hidden py-0 border">
      <div className="flex items-stretch flex-col sm:flex-row">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className="relative w-full h-24 sm:w-40 sm:h-full flex items-center justify-center overflow-hidden">
            {/* Contributors (overflowing row) */}
            <div className="absolute inset-0 flex flex-wrap content-start z-0 space-x-1 space-y-1 px-2 py-1">
              {displayContributors.slice(0, window.innerWidth < 640 ? 15 : 30).map((contributor: string, index: number) => {
                const contributorName = contributor.trim();
                return (
                  <Avatar key={`${contributorName}-${index}`} className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 ring-1 ring-gray-600 ring-offset-1 ring-offset-gray-800 hover:ring-blue-400 transition-all duration-200 hover:scale-110">
                    <AvatarImage src={`https://github.com/${contributorName}.png`} alt={contributorName} />
                    <AvatarFallback className="bg-gray-600 text-white text-[8px] sm:text-[10px]">{contributorName.split("").slice(0, 2).join("").toUpperCase()}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <div
              className="absolute inset-0 bg-black/30 z-[5]"
              style={{
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(1px)",
              }}
            ></div>
            {/* Owner Avatar (positioned on top) */}
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800 absolute">
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
        <CardContent className="flex-1 flex flex-col justify-center space-y-2 py-3 sm:py-4 px-3 sm:pl-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 leading-tight">{list.name}</h3>
            <p className="text-white text-xs sm:text-xs leading-relaxed">{list.description}</p>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <div className="flex items-center gap-2 bg-black/30 rounded-md p-2 border border-gray-700 max-w-full">
              <ScrollArea className="w-32 sm:w-60 flex-1 whitespace-nowrap">
                <span className="text-gray-300 text-[10px] sm:text-[11px] font-mono whitespace-nowrap">{list.repositoryUrl}</span>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-6 sm:h-7 px-1.5 sm:px-2 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-200 text-xs">
                {copied ? (
                  <>
                    <Check className="h-3 w-3 sm:mr-1 text-green-400" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{list.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              <span>{list.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>by</span>
              <span className="text-blue-400 font-medium truncate max-w-20 sm:max-w-none">{list.owner}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};