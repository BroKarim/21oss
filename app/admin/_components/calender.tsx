"use client";

import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { H5 } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";

type Tool = {
  slug: string;
  name: string;
  publishedAt: Date | null;
};

type CalendarDayProps = ComponentProps<"td"> & {
  day: Date;
  currentDate: Date;
  tools: Tool[];
};

const CalendarDay = ({ className, day, tools, currentDate, ...props }: CalendarDayProps) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentDate);
  const publishedTools = tools.filter(({ publishedAt }) => publishedAt && isSameDay(publishedAt, day));

  return (
    <td className={cn("h-16 p-2 border align-top", !isCurrentMonth && "bg-muted text-muted-foreground/50", className)} {...props}>
      <Stack size="xs" direction="column">
        <div className={cn("text-xs", isToday ? "font-semibold text-primary opacity-100" : "opacity-50")}>{format(day, "d")}</div>

        {publishedTools.map((tool) => (
          <Link key={tool.slug} href={`/admin/tools/${tool.slug}`} className="font-medium truncate hover:text-primary w-full">
            {tool.name}
          </Link>
        ))}
      </Stack>
    </td>
  );
};

type CalendarProps = ComponentProps<"div"> & {
  tools?: Tool[];
};

export const Calendar = ({ className, tools = [], ...props }: CalendarProps) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  // Data dummy untuk tools
  const dummyTools: Tool[] = [
    { slug: "figma", name: "Figma", publishedAt: new Date(2025, 6, 15) },
    { slug: "notion", name: "Notion", publishedAt: new Date(2025, 6, 18) },
    { slug: "slack", name: "Slack", publishedAt: new Date(2025, 6, 22) },
    { slug: "trello", name: "Trello", publishedAt: new Date(2025, 6, 25) },
    { slug: "discord", name: "Discord", publishedAt: new Date(2025, 6, 28) },
    { slug: "github", name: "GitHub", publishedAt: new Date(2025, 7, 2) },
    { slug: "vercel", name: "Vercel", publishedAt: new Date(2025, 7, 5) },
    { slug: "linear", name: "Linear", publishedAt: new Date(2025, 7, 8) },
    { slug: "supabase", name: "Supabase", publishedAt: new Date(2025, 7, 12) },
    { slug: "framer", name: "Framer", publishedAt: new Date(2025, 7, 15) },
  ];

  const toolsData = tools.length > 0 ? tools : dummyTools;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => days.slice(i * 7, (i + 1) * 7));

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Stack className="justify-between">
        <Button variant="secondary" size="sm" />

        <H5>{format(currentDate, "MMMM yyyy")}</H5>

        <Button variant="secondary" size="sm" onClick={() => setCurrentDate((date) => addMonths(date, 1))} />
      </Stack>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <th key={day} style={{ width: index < 5 ? "16%" : "10%" }} className="text-start text-muted-foreground p-2 text-xs font-normal">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day) => (
                <CalendarDay key={day.toISOString()} day={day} tools={toolsData} currentDate={currentDate} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
