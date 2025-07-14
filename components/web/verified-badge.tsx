import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cx } from "@/lib/utils";

type VerifiedBadgeProps = Omit<ComponentProps<typeof Icon>, "name"> & {
  size?: "sm" | "md" | "lg";
};

export const VerifiedBadge = ({ className, size = "md", ...props }: VerifiedBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Icon name="verified-badge" className={cx("-ml-1 shrink-0 stroke-0", size === "sm" && "-mb-[0.15em] size-4", size === "md" && "-mb-[0.2em] size-5", size === "lg" && "-mb-[0.25em] size-6", className)} {...props} />
      </TooltipTrigger>
      <TooltipContent>
        <p>Verified</p>
      </TooltipContent>
    </Tooltip>
  );
};
