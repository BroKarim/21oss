"use client";

import type { ComponentProps } from "react";
import { formatNumber } from "@primoui/utils";
import { useEffect, useState, useRef } from "react";
import { GitFork, Star, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { ToolList } from "@/server/web/tools/payloads";
import ComponentPreviewImage from "../../card/card-image";
import { Icons } from "../../icons";
import { formatDistanceToNowStrict } from "date-fns";
import { Insights } from "@/components/ui/insights";

type ResourceCardProps = ComponentProps<typeof Card> & {
  tool: ToolList;
};

const ResourceCard = ({ tool, ...props }: ResourceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const lastCommitDate = tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true });

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
        rootMargin: "200px", // Load 200px sebelum masuk viewport
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const insights = [
    {
      label: "Stars",
      value: formatNumber(tool.stars, "standard"),
      icon: <Star />,
    },
    {
      label: "Forks",
      value: formatNumber(tool.forks, "standard"),
      icon: <GitFork />,
    },
    { label: "Last commit", value: lastCommitDate, icon: <Timer /> },
  ];

  const primaryImage = tool.screenshots?.find((s) => s.order === 0)?.imageUrl;
  const stacks = tool.stacks?.slice(0, 3) ?? [];
  const href = tool.websiteUrl ?? tool.repositoryUrl;

  const handleCardClick = () => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card ref={cardRef} {...props} className="p-0 border-none bg-transparent shadow-none  group">
      <div className="relative w-full space-y-2">
        {!isVisible ? (
          // Skeleton sebelum visible
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
            <div className="relative w-full aspect-video  overflow-hidden shadow-base">
              <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover " priority={false} />

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
                {tool.repositoryUrl && (
                  <div className="flex justify-end">
                    <Link href={tool.repositoryUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white hover:opacity-80 pointer-events-auto">
                      <Icons.gitHubOpenmoji className="w-8 h-8" />
                    </Link>
                  </div>
                )}
              </div>
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
