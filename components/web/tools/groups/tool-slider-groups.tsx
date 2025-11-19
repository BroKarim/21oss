"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-shadcn";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Input } from "@/components/ui/input";

type ToolSliderGroupProps = {
  id: string;
  label: string;
  description?: string;
  tools: ToolMany[];
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolSliderGroup = ({ id, label, tools, options, description }: ToolSliderGroupProps) => {
  const { showScroll = false, showViewAll = false, viewAllUrl } = options;

  const displayedTools = showScroll ? tools : tools.slice(0, 4);
  const [copied, setCopied] = useState(false);
  const [fullLink, setFullLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullLink(`${window.location.origin}/#${id}`);
    }
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!displayedTools.length) {
    return (
      <section className="space-y-4" id={id}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="md:text-2xl text-lg font-bold">{label}</h2>
          </div>

          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>
        <div className="text-center text-gray-500">No tools available for this section.</div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4 border p-2 rounded-lg">
      <div className="flex justify-between md:items-center md:flex-row flex-col gap-2">
        <div className="flex flex-col items-start max-w-md space-y-2">
          <AnimatedGradientText speed={2} colorFrom="#8b5cf6" colorTo="#ec4899" className="md:text-2xl font-bold text-lg">
            {label}
          </AnimatedGradientText>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share this section</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input readOnly value={fullLink} />
              <Button variant="secondary" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {showScroll ? (
        <ScrollArea className="whitespace-nowrap rounded-md pb-4">
          <div className="flex w-max space-x-4">
            {displayedTools.map((tool) => (
              <div key={tool.id} className="w-[280px] shrink-0 sm:w-[320px]">
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedTools.map((tool) => (
            <div key={tool.id} className="min-w-0">
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
