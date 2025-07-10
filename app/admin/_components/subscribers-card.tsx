import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import type { ComponentProps } from "react";
import { Chart, type ChartData } from "./chart";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { H2 } from "@/components/ui/heading";

// Generate dummy data for the last 30 days
const generateDummyData = () => {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
  const today = new Date();

  // Generate random subscriber counts (between 5-25 per day)
  const results: ChartData[] = eachDayOfInterval({
    start: thirtyDaysAgo,
    end: today,
  }).map((day) => ({
    date: format(day, "yyyy-MM-dd"),
    value: Math.floor(Math.random() * 20) + 5,
  }));

  const totalSubscribers = results.reduce((sum, day) => sum + day.value, 0);
  const averageSubscribers = totalSubscribers / results.length;

  return { results, totalSubscribers, averageSubscribers };
};

const SubscribersCard = ({ ...props }: ComponentProps<typeof Card>) => {
  // Use dummy data instead of API call
  const { results, totalSubscribers, averageSubscribers } = generateDummyData();

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Subscribers</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalSubscribers.toLocaleString()}</H2>
      </CardHeader>

      <Chart data={results} average={averageSubscribers} className="w-full" cellClassName="bg-chart-2" label="Subscriber" />
    </Card>
  );
};

export { SubscribersCard };
