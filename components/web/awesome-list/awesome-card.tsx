"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GitFork, Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Hook untuk Intersection Observer
const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
};

// Komponen Avatar yang dioptimalkan
const OptimizedAvatar = ({ contributor, index, isVisible }: { contributor: string | undefined; index: number; isVisible: boolean }) => {
  const [imageError, setImageError] = useState(false);

  if (!contributor) {
    // Empty placeholder untuk slot kosong
    return (
      <div
        className={`
          w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gray-800/50 
          ring-1 ring-gray-700/50
          ${index >= 6 ? "hidden sm:block" : ""}
        `}
      />
    );
  }

  const contributorName = contributor.trim();

  if (!contributor) {
    // Empty placeholder untuk slot kosong
    return (
      <div
        className={`
          w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-800/50 
          ring-1 ring-gray-700/50
          ${index >= 6 ? "hidden sm:block" : ""}
        `}
      />
    );
  }

  if (!isVisible) {
    // Skeleton placeholder
    return (
      <div
        className={`
          flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700 
          animate-pulse ring-1 ring-gray-600 ring-offset-1 ring-offset-gray-800
          ${index >= 6 ? "hidden sm:block" : ""}
        `}
        style={{ animationDelay: `${index * 50}ms` }}
      />
    );
  }

  return (
    <Avatar
      className={`
        flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 ring-1 ring-gray-600
        ring-offset-1 ring-offset-gray-800 hover:ring-blue-400
        transition-all duration-200 hover:scale-110 hover:z-10
        ${index >= 6 ? "hidden sm:flex" : ""}
      `}
    >
      {!imageError && <AvatarImage src={`https://github.com/${contributorName}.png`} alt={contributorName} loading="lazy" onError={() => setImageError(true)} className="transition-opacity duration-300" />}
      <AvatarFallback className="bg-gray-600 text-white text-[6px] sm:text-[8px]">{contributorName.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export const AwesomeCard = ({ list }: { list: any }) => {
  const [copied, setCopied] = useState(false);
  const { ref, inView } = useInView(0.1);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(list.repositoryUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Optimasi: Memoize contributors processing - TANPA DUPLIKASI
  const contributorsData = useMemo(() => {
    if (!list.contributors) return { contributors: [], totalContributors: 0 };

    const allContributors = list.contributors
      .split(",")
      .map((c: string) => c.trim())
      .filter(Boolean);
    const uniqueContributors = [...new Set(allContributors)]; // Hapus duplikat
    const displayContributors = uniqueContributors.slice(0, 24); // Batasi ke 12 saja

    return {
      contributors: displayContributors,
      totalContributors: uniqueContributors.length,
    };
  }, [list.contributors]);

  const { contributors, totalContributors } = contributorsData;

  return (
    <>
      <Card className="w-full text-white overflow-hidden py-0 border group" ref={ref}>
        <div className="flex items-stretch flex-col sm:flex-row">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="relative w-full h-24 sm:w-40 sm:h-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0 p-2">
                <div className="absolute inset-0 flex flex-wrap content-start z-0 gap-4 px-2 py-1">
                  {Array.from({ length: 24 }, (_, index) => {
                    const contributor = contributors[index];
                    return contributor ? (
                      <OptimizedAvatar key={`${contributor}-${index}`} contributor={contributor} index={index} isVisible={inView} />
                    ) : (
                      <div
                        key={`placeholder-${index}`}
                        className={`
                        w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-800/50 
                        ring-1 ring-gray-700/50
                        ${index >= 6 ? "hidden sm:block" : ""}
                      `}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Backdrop blur overlay */}
              <div
                className="absolute inset-0 bg-black/30 z-[5]"
                style={{
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(1px)",
                }}
              />

              {/* Owner Avatar (positioned on top) */}
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800 absolute">
                <AvatarImage src={`https://github.com/${list.owner}.png`} alt={list.owner} loading="lazy" />
                <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                  {list.owner
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Repository Info */}
          <CardContent className="flex-1 flex flex-col justify-center space-y-2 py-3 sm:py-4 px-3 sm:pl-2">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-1 leading-tight line-clamp-2">{list.name}</h3>
              <p className="text-white text-xs sm:text-xs leading-relaxed line-clamp-2">{list.description}</p>
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
                <span>{list.stars?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                <span>{list.forks || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{totalContributors}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>by</span>
                <span className="text-blue-400 font-medium truncate max-w-20 sm:max-w-none">{list.owner}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
};
