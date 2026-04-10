"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MousePointerClick, Megaphone, Globe, Activity } from "lucide-react";

// ---- Types ----
type Tool = { id: string; name: string; slug: string; faviconUrl: string | null } | null;
type Ad   = { id: string; name: string; websiteUrl: string; faviconUrl: string | null; type: string } | null;

interface Props {
  summary: {
    totalToolClicks: number;
    totalAdClicks: number;
    totalEvents: number;
  };
  topTools: { tool: Tool; clicks: number }[];
  topAds: { ad: Ad; clicks: number }[];
  visitorOrigin: { domain: string; visits: number }[];
  trafficByHour: { hour: number; label: string; visits: number }[];
}

// ---- Chart Configs ----
const toolsChartConfig: ChartConfig = {
  clicks: { label: "Klik", color: "hsl(220 70% 50%)" },
};

const adsChartConfig: ChartConfig = {
  clicks: { label: "Klik", color: "hsl(142 72% 40%)" },
};

const hourChartConfig: ChartConfig = {
  visits: { label: "Kunjungan", color: "hsl(265 70% 60%)" },
};

const PIE_COLORS = [
  "hsl(220 70% 50%)",
  "hsl(142 72% 40%)",
  "hsl(265 70% 60%)",
  "hsl(30 85% 55%)",
  "hsl(0 72% 55%)",
  "hsl(185 70% 45%)",
  "hsl(320 70% 55%)",
];

// ---- Stat Card ----
function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// ---- Main Component ----
export function AnalyticsDashboard({ summary, topTools, topAds, visitorOrigin, trafficByHour }: Props) {
  const toolsData = topTools.map((t) => ({
    name: t.tool?.name ?? "Unknown",
    clicks: t.clicks,
  }));

  const adsData = topAds.map((a) => ({
    name: a.ad?.name ?? "Unknown",
    clicks: a.clicks,
  }));

  const originData = visitorOrigin.map((o) => ({
    name: o.domain || "Direct",
    value: o.visits,
  }));

  const hasData = summary.totalEvents > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Data klik & kunjungan — 30 hari terakhir
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Events"
          value={summary.totalEvents}
          icon={Activity}
          description="Semua event yang tercatat"
          color="bg-violet-500"
        />
        <StatCard
          title="Tool Clicks"
          value={summary.totalToolClicks}
          icon={MousePointerClick}
          description="Jumlah klik ke template/tool"
          color="bg-blue-500"
        />
        <StatCard
          title="Ad Clicks"
          value={summary.totalAdClicks}
          icon={Megaphone}
          description="Jumlah klik ke iklan"
          color="bg-emerald-500"
        />
      </div>

      {!hasData && (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <Globe className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p className="text-sm">Belum ada data analytics.</p>
          <p className="text-xs mt-1">Data akan muncul setelah tracking diintegrasikan ke frontend.</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Row 1: Top Tools + Top Ads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template / Tool Terpopuler</CardTitle>
                <CardDescription>Berdasarkan jumlah klik</CardDescription>
              </CardHeader>
              <CardContent>
                {toolsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada data</p>
                ) : (
                  <ChartContainer config={toolsChartConfig} className="h-64 w-full">
                    <BarChart data={toolsData} layout="vertical" margin={{ left: 8, right: 24 }}>
                      <CartesianGrid horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Ads */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Iklan Terpopuler</CardTitle>
                <CardDescription>Berdasarkan jumlah klik</CardDescription>
              </CardHeader>
              <CardContent>
                {adsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada data</p>
                ) : (
                  <ChartContainer config={adsChartConfig} className="h-64 w-full">
                    <BarChart data={adsData} layout="vertical" margin={{ left: 8, right: 24 }}>
                      <CartesianGrid horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Traffic by Hour + Visitor Origin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Traffic by Hour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Traffic per Jam</CardTitle>
                <CardDescription>Distribusi kunjungan dalam sehari</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={hourChartConfig} className="h-64 w-full">
                  <BarChart data={trafficByHour} margin={{ left: -8, right: 8 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      interval={3}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="visits" fill="var(--color-visits)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Visitor Origin Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Asal Pengunjung</CardTitle>
                <CardDescription>Berdasarkan domain referrer</CardDescription>
              </CardHeader>
              <CardContent>
                {originData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada data</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={originData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={35}
                        >
                          {originData.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          contentStyle={{
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="space-y-1.5">
                      {originData.slice(0, 6).map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                            />
                            <span className="text-muted-foreground truncate max-w-[160px]">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-medium tabular-nums">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
