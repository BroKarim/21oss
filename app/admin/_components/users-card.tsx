import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import type { ComponentProps } from "react";
import { Chart, type ChartData } from "./chart";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { H2 } from "@/components/ui/heading";

// Generate dummy user data for the last 30 days
const generateDummyUserData = () => {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
  const today = new Date();

  // Generate random user counts (between 3-15 per day)
  const results: ChartData[] = eachDayOfInterval({
    start: thirtyDaysAgo,
    end: today,
  }).map((day) => ({
    date: format(day, "yyyy-MM-dd"),
    value: Math.floor(Math.random() * 12) + 3,
  }));

  const totalUsers = results.reduce((sum, day) => sum + day.value, 0);
  const averageUsers = totalUsers / results.length;

  return { results, totalUsers, averageUsers };
};

const UsersCard = ({ ...props }: ComponentProps<typeof Card>) => {
  // Use dummy data instead of database query
  const { results, totalUsers, averageUsers } = generateDummyUserData();

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Users</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalUsers.toLocaleString()}</H2>
      </CardHeader>

      <Chart data={results} average={averageUsers} className="w-full" cellClassName="bg-chart-1" label="User" />
    </Card>
  );
};

export { UsersCard };
