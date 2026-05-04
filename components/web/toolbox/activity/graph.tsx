"use client";

import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
  type Activity,
} from "@/components/web/toolbox/activity/template/by-chandai/contribution-graph";
import type { ContributionDay } from "@/lib/toolbox/activity/get-activity-data";
import { cn } from "@/lib/utils";
import type { ActivityGraphPalette, ActivityGraphVariant } from "@/lib/toolbox/activity/schema";
import { addDays, eachDayOfInterval, endOfWeek, format, startOfWeek, subDays } from "date-fns";

type GitHubActivityGraphProps = {
  data: ContributionDay[];
  totalContributions?: number;
  palette?: ActivityGraphPalette;
  variant?: ActivityGraphVariant;
  className?: string;
};

const PALETTE_MAP: Record<ActivityGraphPalette, string[]> = {
  github: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  emerald: ["#ecfdf5", "#a7f3d0", "#6ee7b7", "#34d399", "#059669"],
  ocean: ["#eff6ff", "#93c5fd", "#60a5fa", "#2563eb", "#1d4ed8"],
  sunset: ["#fff7ed", "#fdba74", "#fb923c", "#f97316", "#c2410c"],
};

const WEEKS = 53;
const DAYS = 7;

function getColor(count: number, colors: string[]) {
  if (count <= 0) return colors[0];
  if (count === 1) return colors[1];
  if (count <= 3) return colors[2];
  if (count <= 6) return colors[3];
  return colors[4] ?? colors[colors.length - 1];
}

function getWeekMatrix() {
  const today = new Date();
  const startDate = subDays(today, 364);
  const firstWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

  return Array.from({ length: WEEKS }, (_, weekIndex) => {
    const currentWeekStart = addDays(firstWeekStart, weekIndex * DAYS);

    return eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
    });
  });
}

function getVariantShell(variant: ActivityGraphVariant) {
  if (variant === "minimal") {
    return "rounded-[28px] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#09111d]";
  }

  if (variant === "spotlight") {
    return "rounded-[32px] border border-sky-200 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.35),_transparent_36%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 dark:border-cyan-400/20 dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]";
  }

  return "rounded-[30px] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0b1220]";
}

function getVariantGrid(variant: ActivityGraphVariant) {
  if (variant === "minimal") return "gap-[5px]";
  if (variant === "spotlight") return "gap-1.5";
  return "gap-1";
}

function getMonthLabel(week: Date[]) {
  const firstDay = week[0];

  return firstDay.getDate() <= 7 ? format(firstDay, "MMM") : "";
}

function getContributionLevel(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function GitHubActivityGraph({ data, totalContributions, palette = "github", variant = "card", className }: GitHubActivityGraphProps) {
  if (variant === "chandai") {
    const activityData: Activity[] = data.map((item) => ({
      date: format(new Date(item.date), "yyyy-MM-dd"),
      count: item.count,
      level: getContributionLevel(item.count),
    }));

    const total = totalContributions ?? data.reduce((sum, item) => sum + item.count, 0);

    return (
      <section className={cn("overflow-hidden rounded-[30px] border border-border/70 bg-background p-5 md:p-6", className)}>
        <ContributionGraph className="mx-auto py-2" data={activityData} blockSize={11} blockMargin={3} blockRadius={2} totalCount={total}>
          <ContributionGraphCalendar className="no-scrollbar px-2">{({ activity, dayIndex, weekIndex }) => <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />}</ContributionGraphCalendar>
          <ContributionGraphFooter className="px-2">
            <ContributionGraphTotalCount />
            <ContributionGraphLegend />
          </ContributionGraphFooter>
        </ContributionGraph>
      </section>
    );
  }

  const colors = PALETTE_MAP[palette];
  const weeks = getWeekMatrix();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const contributionMap = new Map(
    data.map((item) => {
      const key = format(new Date(item.date), "yyyy-MM-dd");
      return [key, item.count] as const;
    }),
  );

  return (
    <section className={cn("text-slate-950 shadow-sm dark:text-white dark:shadow-[0_18px_80px_rgba(0,0,0,0.28)]", getVariantShell(variant), className)}>
      <div className="flex flex-col gap-5">
        <div className={cn("overflow-x-auto ")}>
          <div className="min-w-[760px]">
            <div className="mb-3 grid grid-cols-[40px_repeat(53,minmax(0,1fr))] items-center gap-1">
              <span />
              {weeks.map((week, index) => (
                <span key={`${week[0]?.toISOString() ?? index}-month`} className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {getMonthLabel(week)}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-[40px_1fr] gap-3">
              <div className="grid grid-rows-7 gap-1 pt-0.5">
                {dayLabels.map((day) => (
                  <span key={day} className="flex h-3 items-center text-[10px] text-slate-500 dark:text-slate-400">
                    {day}
                  </span>
                ))}
              </div>

              <div className={cn("flex", getVariantGrid(variant))}>
                {weeks.map((week, weekIndex) => (
                  <div key={`${week[0]?.toISOString() ?? weekIndex}-week`} className={cn("flex flex-col", getVariantGrid(variant))}>
                    {week.map((day) => {
                      const key = format(day, "yyyy-MM-dd");
                      const count = contributionMap.get(key) ?? 0;

                      return (
                        <div
                          key={key}
                          className={cn(
                            "size-3 rounded-[4px] border border-black/5 transition-transform duration-150 hover:scale-110",
                            variant === "minimal" && "size-[11px] rounded-[3px]",
                            variant === "spotlight" && "size-[13px] rounded-[5px]",
                          )}
                          style={{ backgroundColor: getColor(count, colors) }}
                          title={`${format(day, "PPP")}: ${count} contributions`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Less</span>
          {colors.map((color) => (
            <div key={color} className="size-3 rounded-[4px] border border-black/5" style={{ backgroundColor: color }} />
          ))}
          <span className="text-slate-500 dark:text-slate-400">More</span>
        </div>
      </div>
    </section>
  );
}

export const GitHubActivity = GitHubActivityGraph;
