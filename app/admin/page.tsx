import type { Metadata } from "next";
import { getTopTools, getTopAds, getVisitorOrigin, getTrafficByHour, getAnalyticsSummary } from "@/server/admin/analytics/queries";
import { AnalyticsDashboard } from "./_components/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics | Admin",
};

export default async function DashboardPage() {
  const [summary, topTools, topAds, visitorOrigin, trafficByHour] = await Promise.all([getAnalyticsSummary(), getTopTools(), getTopAds(), getVisitorOrigin(), getTrafficByHour()]);

  return <AnalyticsDashboard summary={summary} topTools={topTools} topAds={topAds} visitorOrigin={visitorOrigin} trafficByHour={trafficByHour} />;
}
