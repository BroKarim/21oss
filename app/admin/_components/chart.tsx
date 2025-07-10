"use client";

import { format } from "date-fns";
import plur from "plur";
import type { ComponentProps } from "react";
import { Note } from "@/components/ui/note";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";

export type ChartData = {
  date: string;
  value: number;
};

type ChartProps = Partial<ComponentProps<"div">> & {
  data: ChartData[];
  average?: number;
  cellClassName?: string;
  label?: string;
};

export const Chart = ({ className, cellClassName, data, average, label, ...props }: ChartProps) => {
  if (data.length === 0) {
    return <Note>No data available.</Note>;
  }

  const maxValue = Math.max(...data.map((d) => d.value), average || 0);

  return (
    <div className={cn("relative flex h-full min-h-24 w-full flex-col", className)} {...props}>
      {average !== undefined && (
        <div className="absolute inset-x-0 z-10 flex items-center pointer-events-none" style={{ bottom: `${(average / maxValue) * 100}%` }}>
          <div className="h-px w-full flex-1 border border-dashed border-foreground/15" />

          <Note className="absolute right-0 bottom-1 ">{Math.round(average).toLocaleString()}</Note>
        </div>
      )}

      <div className="flex items-end justify-between gap-1 size-full">
        {data.map((item, index) => (
          <Tooltip key={item.date}>
            <TooltipTrigger asChild>
              <div
                className={cn("flex-1 bg-primary rounded-full transition-[height] duration-300 opacity-75 hover:opacity-100", index === data.length - 1 && "opacity-50", cellClassName)}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-2">
              <Stack size="sm" direction="column">
                <span className="opacity-60">{format(new Date(item.date), "EEE, MMM d, yyyy")}</span>
                <span className="font-medium">
                  {item.value.toLocaleString()} {label && plur(label, item.value)}
                </span>
              </Stack>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
