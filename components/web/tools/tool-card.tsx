//ToolCard

import { formatNumber } from "@primoui/utils";
import type { ComponentProps } from "react";
import { GitFork, Star, Timer } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { H4 } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolMany } from "@/server/web/tools/payloads";
import ComponentPreviewImage from "../list-card/card-image";
import { Insights } from "@/components/ui/insights";
import { formatDistanceToNowStrict } from "date-fns";

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany;
  /**
   * Disables the view transition.
   */
};

const ToolCard = ({ tool, ...props }: ToolCardProps) => {
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
  return (
    <Card asChild {...props} className="p-0 border-none bg-transparent">
      <Link href={`/${tool.slug}`}>
        <CardHeader className="relative aspect-[900/490] group p-0">
          <div className="absolute inset-0">
            <div className="relative w-full h-full rounded-lg shadow-base overflow-hidden">
              <div className="absolute inset-0">
                <ComponentPreviewImage
                  src={tool.screenshots?.find((s) => s.order === 0)?.imageUrl || "/placeholder.svg"}
                  alt="thumbnail"
                  fallbackSrc="/placeholder.svg"
                  className=" w-full h-full border"
                />
              </div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center flex-col justify-center p-4">
                <p className="text-white text-sm text-center leading-relaxed">{tool.description}</p>
                <Insights insights={insights.filter((i) => i.value)} className="mt-auto" />
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="p-0">
          <h2 className="text-base font-semibold text-foreground">{tool.name}</h2>
        </div>
      </Link>
    </Card>
  );
};

const ToolCardSkeleton = () => {
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

export { ToolCard, ToolCardSkeleton };
