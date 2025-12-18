"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { ToolList } from "@/server/web/tools/payloads";
import ComponentPreviewImage from "../../card/card-image";
import { Icons } from "../../icons";

type ResourceCardProps = ComponentProps<typeof Card> & {
  tool: ToolList;
};

const ResourceCard = ({ tool, ...props }: ResourceCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ResourceCardSkeleton />;
  }

  const primaryImage = tool.screenshots?.find((s) => s.order === 0)?.imageUrl;
  const stacks = tool.stacks?.slice(0, 3) ?? [];
  const href = tool.websiteUrl ?? tool.repositoryUrl;

  const handleCardClick = () => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card asChild {...props} className="p-0 border-none bg-transparent shadow-none group">
      <div className="relative w-full">
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
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-base">
            <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex flex-wrap gap-2">
                {stacks.map((stack) => (
                  <Badge key={stack.slug} variant="soft" className="bg-white/90 text-black">
                    {stack.name}
                  </Badge>
                ))}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center flex-col justify-center p-4">
                <p className="text-white text-sm text-center leading-relaxed">{tool.tagline}</p>
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

        <div className="flex items-center gap-3 ">
          {tool.faviconUrl && <img src={tool.faviconUrl} alt={`${tool.name} favicon`} className="w-6 h-6 rounded flex-shrink-0" loading="lazy" />}

          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground truncate">{tool.name}</p>
          </div>
        </div>
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
