"use client";

import { useState, useEffect } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import { ToolCard } from "../tool-card";
import Link from "next/link";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { cx } from "@/lib/utils";

type ToolGalleryGroupProps = {
  id: string;
  label: string;
  description?: string;
  className?: string;
  tools: ToolMany[];
  showGlowingEffect?: boolean;
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
};

export const ToolGalleryGroup = ({ id, label, tools, description, options, className, showGlowingEffect = true }: ToolGalleryGroupProps) => {
  const { showViewAll = false, viewAllUrl, loadMore = false } = options;
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedTools = tools.slice(0, visibleCount);

  const [copied, setCopied] = useState(false);
  const [fullLink, setFullLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullLink(`${window.location.origin}/home?slug=${id}`);
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
          <h2 className="text-2xl font-bold">{label}</h2>
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section id={id} className={cx("w-full max-w-full space-y-4 border-[0.75px] relative border-border rounded-[1.5rem] p-1 md:p-2 overflow-hidden", className)}>
      <div className="border-none md:border-[0.75px] md:rounded-[1.5rem] md:p-4 lg:p-4 overflow-hidden">
        {showGlowingEffect && (
          <div className="hidden md:block">
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row  sm:items-center mb-4 justify-between gap-2">
          <div className="flex flex-col max-w-lg">
            <AnimatedGradientText speed={2} colorFrom="#4ade80" colorTo="#06b6d4" className="md:text-2xl text-lg font-bold ">
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
                <DialogTitle>Share</DialogTitle>
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

        <div className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden">
          {displayedTools.map((tool, index) => (
            <div key={tool.id} className="w-full min-w-0 overflow-hidden" style={{ order: index }}>
              <div className="w-full max-w-full overflow-hidden md:px-0 px-2">
                <ToolCard tool={tool} />
              </div>
            </div>
          ))}
        </div>

        {loadMore && visibleCount < tools.length && (
          <div className="flex justify-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
