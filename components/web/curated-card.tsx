"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CuratedCardProps {
  description: string;
  title: string;
  previewTools: string[]; 
  totalToolCount: number; 
}

export default function CuratedCard({ description, title, previewTools, totalToolCount }: CuratedCardProps) {
  
  const remaining = totalToolCount - previewTools.length;

  return (
    <Card className="bg-neutral-950 border-neutral-800 text-neutral-200 p-4 w-full h-full hover:border-neutral-700 transition-colors duration-200 group cursor-pointer">
      <CardContent className="flex flex-col gap-3 p-0 h-full justify-between">
        <div className="space-y-3">
          {/* Description */}
          <p className="text-sm text-neutral-400 line-clamp-2 min-h-[40px]">{description}</p>

          {/* Title */}
          <h3 className="text-lg font-semibold text-neutral-100 leading-tight whitespace-normal break-words group-hover:text-white transition-colors">{title}</h3>
        </div>

        {/* Tools Tags */}
        <div className="text-sm text-neutral-500 flex items-center gap-1 flex-wrap pt-2">
          {previewTools.map((toolName, i) => (
            <span key={i} className="bg-neutral-900 px-2 py-1 rounded text-xs text-neutral-300 border border-neutral-800">
              {toolName}
            </span>
          ))}

          {/* Tampilkan sisa jika ada */}
          {remaining > 0 && <span className="text-xs text-neutral-500 font-medium ml-1">+{remaining} more</span>}
        </div>
      </CardContent>
    </Card>
  );
}
