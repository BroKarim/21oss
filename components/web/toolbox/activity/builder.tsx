"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeExportDialog } from "@/components/ui/code-export-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { H1 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getActivityData } from "@/lib/toolbox/activity/get-activity-data";
import { parseGitHubUrl, type GitHubActivityTarget } from "@/lib/toolbox/activity/parse-github-url";
import type { ActivityExportCodeFile } from "@/lib/toolbox/activity/export-code";
import { ACTIVITY_GRAPH_PALETTES, ACTIVITY_GRAPH_VARIANTS, activityGraphInputSchema, type ActivityGraphPalette, type ActivityGraphVariant } from "@/lib/toolbox/activity/schema";
import { ChevronDown, Download, FileCode2, ImageDown, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { loadActivityExportCode } from "@/server/web/toolbox/activity/actions";
import { GitHubActivityGraph } from "./graph";

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

type ExportAction = "export-code" | "export-image" | "copy-image";

const EXPORT_ACTION_ICON: Record<ExportAction, typeof FileCode2> = {
  "export-code": FileCode2,
  "export-image": Download,
  "copy-image": ImageDown,
};

const EXPORT_OPTIONS: Array<{ value: ExportAction; label: string; description: string }> = [
  { value: "export-code", label: "Export Code", description: "Review file TSX untuk template aktif di dialog." },
  { value: "export-image", label: "Export Image", description: "Simpan preview sebagai gambar. Masih placeholder." },
  { value: "copy-image", label: "Copy Image", description: "Salin preview sebagai gambar. Masih placeholder." },
];

export function ActivityBuilder() {
  const [url, setUrl] = useState("");
  const [palette, setPalette] = useState<ActivityGraphPalette>("github");
  const [variant, setVariant] = useState<ActivityGraphVariant>("card");
  const [exportAction, setExportAction] = useState<ExportAction>("export-code");
  const [isExportCodeDialogOpen, setIsExportCodeDialogOpen] = useState(false);
  const [target, setTarget] = useState<GitHubActivityTarget | null>(null);
  const exportCodeAction = useServerAction(loadActivityExportCode);

  const activityData = useMemo(() => {
    if (!target) return [];

    return getActivityData(target);
  }, [target]);

  const totalContributions = useMemo(() => activityData.reduce((sum, item) => sum + item.count, 0), [activityData]);

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = activityGraphInputSchema.safeParse({
      url,
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

  async function loadExportCodeFiles() {
    const [files, err] = await exportCodeAction.execute({
      palette,
      variant,
    });

    if (err || !files) {
      throw new Error(err?.message ?? "Failed to load export code.");
    }

    return files as ActivityExportCodeFile[];
  }

  function handleExportImage() {
    toast.message("Export image wiring next step. UI shell ready.");
  }

  function handleCopyImage() {
    toast.message("Copy image wiring next step. UI shell ready.");
  }

  async function runExportAction(action: ExportAction) {
    if (action === "export-code") {
      setIsExportCodeDialogOpen(true);
      return;
    }

    if (action === "export-image") {
      handleExportImage();
      return;
    }

    handleCopyImage();
  }

  async function handleExportActionSelect(action: ExportAction) {
    setExportAction(action);
    await runExportAction(action);
  }

  const ExportActionIcon = EXPORT_ACTION_ICON[exportAction];
  const selectedExportOption = EXPORT_OPTIONS.find((option) => option.value === exportAction) ?? EXPORT_OPTIONS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10" style={{ scrollbarGutter: "stable" }}>
      <section className="overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] p-6 shadow-sm dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(15,23,42,0.94))] md:p-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" size="lg" className="mb-4 rounded-full px-3">
            Toolbox / Activity
          </Badge>
          <H1 className="text-balance">Generate GitHub Activity Graph UI</H1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Paste GitHub profile or repository URL. Generate first, then tune palette and template from editor panel.</p>

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
              <div className="min-w-[220px] flex-1 basis-[220px] space-y-2">
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

              <div className="min-w-[220px] flex-1 basis-[220px] space-y-2">
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

              <div className="min-w-[220px] flex-1 basis-[220px] space-y-2">
                <Label htmlFor="activity-export">Export</Label>
                <div id="activity-export" className="inline-flex w-full -space-x-px divide-x divide-primary-foreground/30 rounded-xl shadow-sm shadow-black/5">
                  <Button type="button" size="md" className="h-9 flex-1 rounded-none shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10" onClick={() => runExportAction(exportAction)} prefix={<ExportActionIcon />}>
                    {selectedExportOption.label}
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="md" className="h-9 rounded-none px-3 shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10" aria-label="Export options">
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="max-w-64 md:max-w-xs">
                      <DropdownMenuRadioGroup value={exportAction} onValueChange={(value) => setExportAction(value as ExportAction)}>
                        {EXPORT_OPTIONS.map((option) => (
                          <DropdownMenuRadioItem key={option.value} value={option.value} className="items-start [&>span]:pt-1.5" onClick={() => handleExportActionSelect(option.value)}>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-none">
            <CardContent>
              <GitHubActivityGraph data={activityData} palette={palette} variant={variant} totalContributions={totalContributions} />
            </CardContent>
          </Card>
        </section>
      ) : null}

      <CodeExportDialog
        open={isExportCodeDialogOpen}
        onOpenChange={setIsExportCodeDialogOpen}
        title="Export Code"
        description="Review generated TSX files for current template. Beberapa template butuh lebih dari satu file."
        loadFiles={loadExportCodeFiles}
      />
    </div>
  );
}
