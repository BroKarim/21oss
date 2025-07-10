import type { ComponentProps } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { H2 } from "@/components/ui/heading";
import { Note } from "@/components/ui/note";
import { Calendar } from "./calender";

const ScheduledCard = ({ ...props }: ComponentProps<typeof Card>) => {
  // Data dummy untuk scheduled tools
  const tools = [
    { slug: "figma", name: "Figma", publishedAt: new Date(2025, 6, 15) },
    { slug: "notion", name: "Notion", publishedAt: new Date(2025, 6, 18) },
    { slug: "slack", name: "Slack", publishedAt: new Date(2025, 6, 22) },
    { slug: "trello", name: "Trello", publishedAt: new Date(2025, 6, 25) },
    { slug: "discord", name: "Discord", publishedAt: new Date(2025, 6, 28) },
  ];

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Scheduled Tools</CardDescription>
        <H2>{tools.length}</H2>
      </CardHeader>

      {tools.length ? <Calendar tools={tools} className="w-full h-full" /> : <Note>No scheduled tools at the moment.</Note>}
    </Card>
  );
};

export { ScheduledCard };
