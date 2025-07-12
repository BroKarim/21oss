import { formatDate, formatNumber, isTruthy } from "@primoui/utils";
import { formatDistanceToNowStrict, formatISO } from "date-fns";
import type { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { GitFork, Star, Timer, Copyright, History } from "lucide-react";
import { Insights } from "../ui/insights";
import { ContentOne } from "@/server/web/tools/payload";

import { cn } from "@/lib/utils";
import { Link } from "../ui/link";

type RepositoryDetailsProps = ComponentProps<"div"> & {
  showcase: ContentOne;
};

export const RepositoryDetails = ({ className, showcase, ...props }: RepositoryDetailsProps) => {
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
    showcase.lastCommitDate
      ? {
          label: "Last commit",
          value: formatDistanceToNowStrict(showcase.lastCommitDate, { addSuffix: true }),
          title: formatDate(showcase.lastCommitDate),
          icon: <Timer />,
        }
      : undefined,
    showcase.firstCommitDate
      ? {
          label: "Repository age",
          value: formatDistanceToNowStrict(showcase.firstCommitDate),
          title: formatDate(showcase.firstCommitDate),
          icon: <History />,
        }
      : undefined,
    showcase.license
      ? {
          label: "License",
          value: showcase.license.name,
          link: `/licenses/${showcase.license.slug}`,
          icon: <Copyright />,
        }
      : undefined,
  ];

  return (
    <Card className={cn("items-stretch bg-transparent", className)} {...props}>
      <CardHeader>
        <CardTitle>Details:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Insights insights={insights.filter(isTruthy)} className="text-sm" />

        {showcase.repositoryUrl && (
          <Button variant="secondary" asChild>
            <Link href={showcase.repositoryUrl}>View Repository</Link>
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground/75 text-[11px]">
          Auto-fetched from GitHub{" "}
          <time dateTime={formatISO(showcase.updatedAt)} className="font-medium text-muted-foreground">
            {formatDistanceToNowStrict(showcase.updatedAt, { addSuffix: true })}
          </time>
          .
        </p>
      </CardFooter>
    </Card>
  );
};
