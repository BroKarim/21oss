import { formatDate, formatNumber, isTruthy } from "@primoui/utils";
import { formatDistanceToNowStrict, formatISO } from "date-fns";
import type { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { H5 } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Stack } from "../ui/stack";
import { Insights } from "../ui/insights";
import { ContentOne } from "@/server/web/showcase/payload";

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
      icon: <Icon name="lucide/star" />,
    },
    {
      label: "Forks",
      value: formatNumber(showcase.forks, "standard"),
      icon: <Icon name="lucide/git-fork" />,
    },
    showcase.lastCommitDate
      ? {
          label: "Last commit",
          value: formatDistanceToNowStrict(showcase.lastCommitDate, { addSuffix: true }),
          title: formatDate(showcase.lastCommitDate),
          icon: <Icon name="lucide/timer" />,
        }
      : undefined,
    showcase.firstCommitDate
      ? {
          label: "Repository age",
          value: formatDistanceToNowStrict(showcase.firstCommitDate),
          title: formatDate(showcase.firstCommitDate),
          icon: <Icon name="lucide/history" />,
        }
      : undefined,
    showcase.license
      ? {
          label: "License",
          value: showcase.license.name,
          link: `/licenses/${showcase.license.slug}`,
          icon: <Icon name="lucide/copyright" />,
        }
      : undefined,
  ];

  return (
    <Card className={cn("items-stretch bg-transparent", className)} {...props}>
      <Stack direction="column">
        <Stack size="sm" className="w-full justify-between">
          <H5 as="strong">Details:</H5>
        </Stack>

        <Insights insights={insights.filter(isTruthy)} className="text-sm" />
      </Stack>

      {showcase.repositoryUrl && (
        <Button variant="secondary" className="mt-1 self-start" asChild>
          <Link href={showcase.repositoryUrl}>View Repository</Link>
        </Button>
      )}

      <p className="text-muted-foreground/75 text-[11px]">
        Auto-fetched from GitHub{" "}
        <time dateTime={formatISO(showcase.updatedAt)} className="font-medium text-muted-foreground">
          {formatDistanceToNowStrict(showcase.updatedAt, { addSuffix: true })}
        </time>
        .
      </p>
    </Card>
  );
};
