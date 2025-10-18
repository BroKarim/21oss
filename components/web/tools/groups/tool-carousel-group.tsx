"use client";

import { useState, useRef } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { Button } from "@/components/ui/button-shadcn";
import { ChevronLeft, ChevronRight, Star, GitFork, Timer, ExternalLink, Github, Link as LinkIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import ComponentPreviewImage from "../../card/card-image";
import { Insights } from "@/components/ui/insights";
import { ToolStacks } from "@/components/web/tools/tool-stacks";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Favicon } from "@/components/ui/favicon";
import { formatNumber } from "@primoui/utils";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ToolCarouselGroupProps = {
  id: string;
  label: string;
  description?: string;
  tools: ToolMany[];
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolCarouselGroup = ({ label, description, tools, id }: ToolCarouselGroupProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => setCurrentIndex((prev) => (prev === 0 ? tools.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === tools.length - 1 ? 0 : prev + 1));

  const currentTool = tools[currentIndex];
  const primaryImage = currentTool.screenshots?.find((s) => s.order === 0)?.imageUrl;

  const lastCommitDate = currentTool.lastCommitDate && formatDistanceToNowStrict(currentTool.lastCommitDate, { addSuffix: true });

  const insights = [
    { label: "Stars", value: formatNumber(currentTool.stars, "standard"), icon: <Star /> },
    { label: "Forks", value: formatNumber(currentTool.forks, "standard"), icon: <GitFork /> },
    { label: "Last commit", value: lastCommitDate, icon: <Timer /> },
  ];

  const [copied, setCopied] = useState(false);
  const fullLink = `${typeof window !== "undefined" ? window.location.origin : ""}/#${id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className="w-full max-w-full relative space-y-4 rounded-lg border p-3 md:p-4">
      {/* Header */}
      <div className="w-full flex justify-between md:items-center md:flex-row flex-col">
        <div className="flex flex-col ">
          <AnimatedGradientText className="text-lg md:text-2xl font-semibold">{label}</AnimatedGradientText>
          {description && <p className="text-xs md:text-sm text-muted-foreground max-w-md">{description}</p>}
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

      {/* Unified Layout */}
      <div
        ref={containerRef}
        className={cn("relative flex flex-col md:flex-row items-stretch gap-4 md:gap-6 rounded-lg overflow-hidden", "transition-all duration-300")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full md:w-1/2 h-52 md:h-[33vh] rounded-lg overflow-hidden group">
          <ComponentPreviewImage src={primaryImage} alt={`${currentTool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />

          <div className="absolute inset-0 bg-black/80 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Insights insights={insights.filter((i) => i.value)} />
          </div>

          {isHovered && (
            <>
              <Button variant="ghost" size="icon" onClick={handlePrevious} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <Favicon src={currentTool.faviconUrl} title={currentTool.name} className="size-6 md:size-8 p-1 rounded-md" />
            <h3 className="text-base md:text-lg font-semibold truncate">{currentTool.name}</h3>
          </div>

          <p className="text-xs md:text-sm text-foreground/80 line-clamp-3">{currentTool.description || currentTool.tagline}</p>

          <div>
            <p className="text-xs font-medium text-foreground/60 mb-1">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              <ToolStacks stacks={currentTool.stacks} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {currentTool.websiteUrl && (
              <Link href={currentTool.websiteUrl} rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  <ExternalLink className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                  Visit Website
                </Button>
              </Link>
            )}
            {currentTool.repositoryUrl && (
              <Link href={currentTool.repositoryUrl} rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="text-xs md:text-sm">
                  <Github className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                  Repository
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dots pagination */}
      <div className="flex justify-center gap-2 mt-3">
        {tools.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={cn("h-2 rounded-full transition-all", index === currentIndex ? "bg-foreground w-6" : "bg-foreground/30 w-2")} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </section>
  );
};
