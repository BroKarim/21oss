import { formatDate } from "@primoui/utils";
import { differenceInDays } from "date-fns";
import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/icon";
import { Stack } from "@/components/ui/stack";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Discount } from "@/components/web/discount";
import type { ToolMany, ToolManyExtended, ToolOne } from "@/server/web/tools/payloads";
import { cx } from "@/lib/utils";

type ToolBadgesProps = ComponentProps<typeof Stack> & {
  tool: ToolOne | ToolMany | ToolManyExtended;
};

export const ToolBadges = ({ tool, children, className, ...props }: ToolBadgesProps) => {
  const { firstCommitDate, publishedAt, discountCode, discountAmount } = tool;

  const commitDiff = firstCommitDate ? differenceInDays(new Date(), firstCommitDate) : null;
  const isNew = commitDiff !== null && commitDiff <= 365;
  const isScheduled = publishedAt !== null && publishedAt > new Date();

  return (
    <Stack size="sm" wrap={false} className={cx("justify-end text-sm empty:hidden", className)} {...props}>
      {isNew && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon name="lucide/sparkles" className="size-4 text-yellow-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Repo is less than 1 year old</p>
          </TooltipContent>
        </Tooltip>
      )}

      {isScheduled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon name="lucide/clock" className="size-4 text-yellow-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{`Scheduled for ${formatDate(publishedAt)}`}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {discountAmount && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon name="lucide/square-percent" className="size-4 text-green-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{<Discount amount={discountAmount} code={discountCode} />}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {children}
    </Stack>
  );
};
