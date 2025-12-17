"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { ToolMany } from "@/server/web/tools/payloads";
import ComponentPreviewImage from "../card/card-image";
import { useMediaQuery } from "@/hooks/use-media-query";

type ResourceCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany;
};

const ResourceCard = ({ tool, ...props }: ResourceCardProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
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

  // DESKTOP
  if (!isMobile) {
    return (
      <Card asChild {...props} className="p-0 border-none bg-transparent shadow-none group">
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <CardHeader className="relative aspect-video p-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-base">
              <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full" priority={false} />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex flex-wrap gap-2">
                  {stacks.map((stack) => (
                    <Badge key={stack.slug} variant="soft" className="bg-white/90 text-black">
                      {stack.name}
                    </Badge>
                  ))}
                </div>

                {tool.repositoryUrl && (
                  <div className="flex justify-end">
                    <Link href={tool.repositoryUrl} target="_blank" onClick={(e) => e.stopPropagation()} className="text-white hover:opacity-80">
                      <Github className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <div className="flex items-center gap-2 mt-2">
            {tool.faviconUrl && <img src={tool.faviconUrl} alt={`${tool.name} favicon`} className="w-5 h-5 rounded" loading="lazy" />}
            <p className="text-base text-foreground">{tool.name}</p>
          </div>
        </Link>
      </Card>
    );
  }

  // MOBILE
  return (
    <Card asChild {...props} className="p-0 border-none bg-transparent">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#222222]">
            <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />
          </div>

          <div className="flex items-start gap-2">
            {tool.faviconUrl && <img src={tool.faviconUrl} alt={`${tool.name} favicon`} className="w-8 h-8 rounded flex-shrink-0" loading="lazy" />}

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{tool.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {stacks.map((stack) => (
                  <Badge key={stack.slug} variant="soft">
                    {stack.name}
                  </Badge>
                ))}
              </div>
            </div>

            {tool.repositoryUrl && (
              <Link href={tool.repositoryUrl} target="_blank" onClick={(e) => e.stopPropagation()} className="ml-auto text-muted-foreground hover:text-foreground">
                <Github className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

const ResourceCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-[16/10] md:aspect-[900/490] rounded-lg" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

export { ResourceCard, ResourceCardSkeleton };
