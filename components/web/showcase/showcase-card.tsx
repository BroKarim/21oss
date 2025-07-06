//ToolCard

import { formatNumber } from "@primoui/utils";
import type { ComponentProps } from "react";
import { GitFork, Star, Timer } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { H4 } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentMany } from "@/server/web/showcase/payload";
import ComponentPreviewImage from "../list-card/card-image";
import { Insights } from "@/components/ui/insights";
import { formatDistanceToNowStrict } from "date-fns";

type ShowcaseCardProps = ComponentProps<typeof Card> & {
  showcase: ContentMany;
  /**
   * Disables the view transition.
   */
  isRelated?: boolean;
};

const ShowCaseCard = ({ showcase, isRelated, ...props }: ShowcaseCardProps) => {
  const lastCommitDate = showcase.lastCommitDate && formatDistanceToNowStrict(showcase.lastCommitDate, { addSuffix: true });
  const insights = [
    {
      label: "Stars",
      value: formatNumber(showcase.stars, "standard"),
      icon: <Star />,
    },
    {
      label: "Forks",
      value: formatNumber(showcase.forks, "standard"),
      icon: <GitFork />,
    },
    { label: "Last commit", value: lastCommitDate, icon: <Timer /> },
  ];
  return (
    <Card asChild {...props} className="block select-none">
      <Link href="/">
        <div className="relative aspect-[4/3] mb-3 group">
          <div className="absolute inset-0">
            <div className="relative w-full h-full rounded-lg shadow-base overflow-hidden">
              <div className="absolute inset-0">
                <ComponentPreviewImage src={showcase.screenshotUrl || "/placeholder.svg"} alt="tes" fallbackSrc="/placeholder.svg" className="rounded-t-lg" />
              </div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center flex-col justify-center p-4">
                <p className="text-white text-sm text-center leading-relaxed">{showcase.description}</p>
                <Insights insights={insights.filter((i) => i.value)} className="mt-auto" />
              </div>
              <div className="absolute inset-0 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <div className="flex items-center justify-between flex-grow min-w-0">
            <div className="block min-w-0 flex-1 mr-3">
              <div className="flex flex-col min-w-0">
                <h2 className="text-sm font-medium text-foreground truncate">{showcase.name}</h2>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

const ShowcaseCardSkeleton = () => {
  return (
    <Card className="items-stretch select-none">
      <CardHeader>
        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-3/4">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <CardFooter>
        <Skeleton className="h-4 w-1/3">&nbsp;</Skeleton>
      </CardFooter>
    </Card>
  );
};

export { ShowCaseCard, ShowcaseCardSkeleton };
