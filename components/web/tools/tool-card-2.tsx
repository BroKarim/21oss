import { formatNumber } from "@primoui/utils";
import type { ComponentProps } from "react";
import { GitFork, Star, Timer, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolMany } from "@/server/web/tools/payloads";
import ComponentPreviewImage from "../card/card-image";
import { Insights } from "@/components/ui/insights";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany;
};

const ToolCard = ({ tool, ...props }: ToolCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const lastCommitDate = tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true });

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
  const allImages =
    tool.screenshots?.filter((s) => {
      const url = s.imageUrl.toLowerCase();
      return /\.(png|jpe?g|webp)(\?.*)?$/i.test(url);
    }) || [];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // DESKTOP VERSION
  if (!isMobile) {
    return (
      <Card asChild {...props} className="p-0 border-none bg-transparent shadow-none gap-2">
        <Link href={`/${tool.slug}`}>
          <CardHeader className="relative aspect-[900/490] group p-0">
            <div className="absolute inset-0">
              <div className="relative w-full h-full rounded-lg shadow-base overflow-hidden">
                <div className="absolute inset-0">
                  <ComponentPreviewImage src={primaryImage} alt={`${tool.name} preview`} fallbackSrc="/placeholder.svg" className="w-full h-full" priority={false} />
                </div>
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center flex-col justify-center p-4">
                  <p className="text-white text-sm text-center leading-relaxed">{tool.tagline}</p>
                  <Insights insights={insights.filter((i) => i.value)} />
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="p-0 flex flex-col">
            <p className="text-base text-foreground">{tool.name}</p>
            <p className="text-xs opacity-50 text-foreground">{tool.platforms?.length ? tool.platforms.map((p) => p.name).join(", ") : ""}</p>
          </div>
        </Link>
      </Card>
    );
  }

  // MOBILE VERSION
  return (
    <Card asChild {...props} className="p-0 border-none bg-transparent shadow-none">
      <Link href={`/${tool.slug}`}>
        <div className="flex flex-col gap-3">
          {/* Carousel */}
          <div className="relative">
            <div className="relative w-full aspect-[16/10] bg-[#222222] rounded-lg overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <div className="relative w-full h-full p-3">
                    <div className="relative w-full h-full rounded-md overflow-hidden bg-[#222222]">
                      <ComponentPreviewImage src={allImages[currentImageIndex]?.imageUrl} alt={`${tool.name} preview ${currentImageIndex + 1}`} fallbackSrc="/placeholder.svg" className="w-full h-full object-cover" priority={false} />
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5 backdrop-blur-sm" aria-label="Previous image">
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5 backdrop-blur-sm" aria-label="Next image">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"}`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#222222]">
                  <span className="text-gray-400 text-sm">No images</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Info */}
          <div className="flex items-start gap-2 px-0">
            {tool.faviconUrl && <img src={tool.faviconUrl} alt={`${tool.name} favicon`} loading="lazy" className="w-8 h-8 rounded flex-shrink-0 mt-0.5" />}
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{tool.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{tool.tagline}</p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

const ToolCardSkeleton = () => {
  return (
    <Card className="items-stretch select-none">
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full aspect-[16/10] rounded-lg" />
        <div className="flex items-start gap-2">
          <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export { ToolCard, ToolCardSkeleton };
