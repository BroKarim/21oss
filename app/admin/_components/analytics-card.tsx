import type { ComponentProps } from "react";
import { Chart } from "./chart";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { H2 } from "@/components/ui/heading";

const dummyResults = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 6, i + 1).toISOString(), // Juli 1–30, 2025
  visitors: Math.floor(Math.random() * 200) + 50, // antara 50 - 250
}));

const totalVisitors = dummyResults.reduce((acc, cur) => acc + cur.visitors, 0);
const averageVisitors = Math.round(totalVisitors / dummyResults.length);

const AnalyticsCard = ({ ...props }: ComponentProps<typeof Card>) => {
  return (
    <Card {...props}>
      <CardHeader className="space-y-1">
        <CardDescription>Visitors</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalVisitors.toLocaleString()}</H2>
      </CardHeader>

      <Chart data={dummyResults.map(({ date, visitors }) => ({ date, value: visitors }))} average={averageVisitors} className="w-full" cellClassName="bg-chart-4" label="Visitor" />
    </Card>
  );
};

export { AnalyticsCard };
