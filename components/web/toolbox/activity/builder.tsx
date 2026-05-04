"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseGitHubUrl, type GitHubActivityTarget } from "@/lib/toolbox/activity/parse-github-url";
import { ACTIVITY_GRAPH_PALETTES, ACTIVITY_GRAPH_THEMES, ACTIVITY_GRAPH_VARIANTS, activityGraphInputSchema, type ActivityGraphPalette, type ActivityGraphTheme, type ActivityGraphVariant } from "@/lib/toolbox/activity/schema";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { GitHubActivityGraph, type ContributionDay } from "./graph";

const PALETTE_PREVIEW: Record<ActivityGraphPalette, string[]> = {
  github: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  emerald: ["#ecfdf5", "#a7f3d0", "#6ee7b7", "#34d399", "#059669"],
  ocean: ["#eff6ff", "#93c5fd", "#60a5fa", "#2563eb", "#1d4ed8"],
  sunset: ["#fff7ed", "#fdba74", "#fb923c", "#f97316", "#c2410c"],
};

function PalettePreview({ palette }: { palette: ActivityGraphPalette }) {
  return (
    <div className="flex items-center gap-1.5">
      {PALETTE_PREVIEW[palette].slice(0, 3).map((color) => (
        <div key={color} className="h-3 w-3 rounded-full border border-black/5" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function seededNumber(seed: string, index: number) {
  let value = 0;

  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i) + index) % 2147483647;
  }

  return value;
}

function buildMockActivity(seed: string): ContributionDay[] {
  const items: ContributionDay[] = [];
  const today = new Date();

  for (let offset = 364; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);

    const base = seededNumber(seed, offset);
    const intensity = base % 11;
    const count = intensity < 4 ? 0 : intensity < 7 ? 1 : intensity < 9 ? 3 : 7;

    items.push({
      date: day.toISOString(),
      count,
    });
  }

  return items;
}

function getTargetLabel(target: GitHubActivityTarget) {
  return target.type === "profile" ? `@${target.username}` : `${target.owner}/${target.repo}`;
}

function getTargetSubtitle(target: GitHubActivityTarget) {
  return target.type === "profile" ? "Profile activity preview" : "Repository activity preview";
}

type ExportAction = "copy-code" | "export-image" | "copy-image";

export function ActivityBuilder() {
  const [url, setUrl] = useState("");
  const [theme, setTheme] = useState<ActivityGraphTheme>("dark");
  const [palette, setPalette] = useState<ActivityGraphPalette>("github");
  const [variant, setVariant] = useState<ActivityGraphVariant>("card");
  const [exportAction, setExportAction] = useState<ExportAction>("copy-code");
  const [target, setTarget] = useState<GitHubActivityTarget | null>(null);

  const activityData = useMemo(() => {
    if (!target) return [];

    return buildMockActivity(target.normalizedUrl);
  }, [target]);

  const totalContributions = useMemo(() => activityData.reduce((sum, item) => sum + item.count, 0), [activityData]);

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = activityGraphInputSchema.safeParse({
      url,
      theme,
      palette,
      variant,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid GitHub URL");
      return;
    }

    const parsedTarget = parseGitHubUrl(result.data.url);

    if (!parsedTarget) {
      toast.error("GitHub URL format not supported yet");
      return;
    }

    setTarget(parsedTarget);
    toast.success("Preview ready. Mock activity now, live data next.");
  }

  async function handleCopyCode() {
    if (!target) return;

    const snippet = [
      'import { GitHubActivityGraph } from "@/components/web/toolbox/activity/graph";',
      "",
      "<GitHubActivityGraph",
      `  title="${getTargetLabel(target)}"`,
      `  subtitle="${getTargetSubtitle(target)}"`,
      `  theme="${theme}"`,
      `  palette="${palette}"`,
      `  variant="${variant}"`,
      "  data={activityData}",
      "/>",
    ].join("\n");

    await navigator.clipboard.writeText(snippet);
    toast.success("Stub component code copied.");
  }

  function handleExportImage() {
    toast.message("Export image wiring next step. UI shell ready.");
  }

  function handleCopyImage() {
    toast.message("Copy image wiring next step. UI shell ready.");
  }

  async function handleExportAction(value: string) {
    const action = value as ExportAction;
    setExportAction(action);

    if (action === "copy-code") {
      await handleCopyCode();
      return;
    }

    if (action === "export-image") {
      handleExportImage();
      return;
    }

    handleCopyImage();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <section className="overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] p-6 shadow-sm dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(15,23,42,0.94))] md:p-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" size="lg" className="mb-4 rounded-full px-3">
            Toolbox / Activity
          </Badge>
          <H1 className="text-balance">Generate GitHub Activity Graph UI</H1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Paste GitHub profile or repository URL. Generate first, then tune palette, template, and theme from editor panel.</p>

          <form onSubmit={handleGenerate} className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-[28px] border border-border/70 bg-background/80 p-3 shadow-sm backdrop-blur md:flex-row md:items-center">
            <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://github.com/brokariim or https://github.com/vercel/next.js" className="h-12 rounded-2xl border-border bg-transparent text-sm md:text-sm" />
            <Button type="submit" size="lg" className="rounded-2xl md:min-w-40" prefix={<Sparkles />}>
              Generate
            </Button>
          </form>
        </div>
      </section>

      {target ? (
        <section className="mt-2 space-y-6">
          <Card className="border-none shadow-none ">
            <CardContent className="flex flex-wrap items-end gap-4 p-6">
              {/* <div className="min-w-[220px] flex-1 space-y-2">
                <Label>Detected target</Label>
                <div className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3">
                  <p className="text-sm font-medium">{getTargetLabel(target)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{target.normalizedUrl}</p>
                </div>
              </div> */}

              <div className="min-w-[180px] flex-1 space-y-2">
                <Label htmlFor="activity-theme">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as ActivityGraphTheme)}>
                  <SelectTrigger id="activity-theme" className="w-full rounded-xl">
                    <SelectValue placeholder="Choose theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_GRAPH_THEMES.map((item) => (
                      <SelectItem key={item} value={item} className="capitalize">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[220px] flex-1 space-y-2">
                <Label htmlFor="activity-palette">Color palette</Label>
                <Select value={palette} onValueChange={(value) => setPalette(value as ActivityGraphPalette)}>
                  <SelectTrigger id="activity-palette" className="w-full rounded-xl">
                    <div className="flex w-full items-center justify-between gap-3 pr-2">
                      <span className="capitalize">{palette}</span>
                      <PalettePreview palette={palette} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_GRAPH_PALETTES.map((item) => (
                      <SelectItem key={item} value={item} className="capitalize">
                        <div className="flex w-full items-center justify-between gap-3">
                          <span>{item}</span>
                          <PalettePreview palette={item} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[180px] flex-1 space-y-2">
                <Label htmlFor="activity-variant">Template</Label>
                <Select value={variant} onValueChange={(value) => setVariant(value as ActivityGraphVariant)}>
                  <SelectTrigger id="activity-variant" className="w-full rounded-xl">
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_GRAPH_VARIANTS.map((item) => (
                      <SelectItem key={item} value={item} className="capitalize">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[220px] flex-1 space-y-2">
                <Label htmlFor="activity-export">Export</Label>
                <Select value={exportAction} onValueChange={handleExportAction}>
                  <SelectTrigger id="activity-export" className="w-full rounded-xl capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copy-code">Copy Code</SelectItem>
                    <SelectItem value="export-image">Export Image</SelectItem>
                    <SelectItem value="copy-image">Copy Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-none">
            <CardContent>
              <GitHubActivityGraph data={activityData} theme={theme} palette={palette} variant={variant} totalContributions={totalContributions} />
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
