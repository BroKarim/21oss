"use client";
import type { ComponentProps } from "react";
import { formatNumber } from "@primoui/utils";
import { useEffect, useState, useRef } from "react";
import { GitFork, Star, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ComponentPreviewImage from "../../card/card-image";
import { formatDistanceToNowStrict } from "date-fns";
import { Insights } from "@/components/ui/insights";
import { trackEvent } from "@/server/web/analytics/actions";
type ResourceToolStack = {
  name: string;
  slug: string;
};
type ResourceToolScreenshot = {
  imageUrl: string;
  order: number;
};
export type ResourceTool = {
  id: string;
  name: string;
  slug: string;
  repositoryUrl?: string | null;
  tagline?: string | null;
  stars?: number | null;
  forks?: number | null;
  faviconUrl?: string | null;
  lastCommitDate?: Date | null;
  screenshots?: ResourceToolScreenshot[];
  stacks?: ResourceToolStack[];
};
type ResourceCardProps = ComponentProps<typeof Card> & {
  tool: ResourceTool;
};
const ResourceCard = ({ tool, ...props }: ResourceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const lastCommitDate = tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true });
  const lastCommitLabel = lastCommitDate ? `last update ${lastCommitDate}` : "last update —";
  const starsLabel = formatNumber(tool.stars ?? 0, "standard");
  const forksLabel = formatNumber(tool.forks ?? 0, "standard");
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      },
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const insights = [
    {
      label: "Stars",
      value: formatNumber(tool.stars ?? 0, "standard"),
      icon: <Star />,
    },
    {
      label: "Forks",
      value: formatNumber(tool.forks ?? 0, "standard"),
      icon: <GitFork />,
    },
    { label: "Last commit", value: lastCommitDate, icon: <Timer /> },
  ];
  const primaryImage = tool.screenshots?.find((s) => s.order === 0)?.imageUrl;
  const stacks = tool.stacks?.slice(0, 3) ?? [];
  const stacksLabel = stacks.length ? stacks.map((stack) => stack.name).join(" · ") : "misc";
  const href = tool.repositoryUrl;
  const handleCardClick = () => {
    if (href) {
      void trackEvent({
        type: "TOOL_CLICK",
        url: window.location.pathname,
        toolId: tool.id,
        country: undefined,
      });
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <Card ref={cardRef} {...props} className="p-0 border-none bg-transparent shadow-none  group">
      <div className="relative w-full space-y-2">
        {!isVisible ? (
          <ResourceCardSkeleton />
        ) : (
          <div
            onClick={handleCardClick}
            className="cursor-pointer"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }}
          >
            <div className="relative w-full aspect-video overflow-hidden shadow-base">
              {primaryImage ? (
                <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover " priority={false} />
              ) : (
                <div className="w-full h-full bg-white dark:bg-neutral-900 border p-4">
                  <div className="flex h-full flex-col">
                    <p className="text-[11px] text-muted-foreground">{lastCommitLabel}</p>
                    <div className="flex-1 flex items-center justify-center text-center px-2">
                      <span className="text-3xl font-bold dark:text-white text-black line-clamp-2 leading-tight tracking-tight">{tool.name}</span>
                    </div>
                    <div className="flex items-end justify-between gap-3 text-[11px] text-muted-foreground">
                      <span className="whitespace-nowrap">
                        {starsLabel} star · {forksLabel} fork
                      </span>
                      <span className="text-right line-clamp-1">{stacksLabel}</span>
                    </div>
                  </div>
                </div>
              )}
              {primaryImage && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center flex-col justify-center p-4">
                    <div className="flex flex-wrap gap-2">
                      {stacks.map((stack) => (
                        <Badge key={stack.slug} variant="soft" className="bg-white/90 text-black">
                          {stack.name}
                        </Badge>
                      ))}
                    </div>
                    <Insights insights={insights.filter((i) => i.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {isVisible && (
          <div className="flex items-center space-x-2 ">
            {tool.faviconUrl && <img src={tool.faviconUrl} alt={`${tool.name} favicon`} className="w-6 h-6 rounded flex-shrink-0" loading="lazy" />}
            <div className="flex-1 flex flex-col min-w-0">
              <p className="text-base font-medium text-foreground truncate">{tool.name}</p>
              <p className="text-neutral-500 text-sm  leading-relaxed">{tool.tagline}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
const ResourceCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-6 h-6 rounded flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};
export { ResourceCard, ResourceCardSkeleton };
