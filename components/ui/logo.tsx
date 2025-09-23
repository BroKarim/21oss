import type { ComponentProps } from "react";
import Link from "next/link";
import { Stack } from "./stack";
import { config } from "@/config";
import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack size="sm" wrap={false} className={cn("group/logo", className)} asChild {...props}>
      <Link href="/">
        {/* <LogoSymbol className="group-hover/logo:rotate-90" /> */}

        <span className="font-medium text-sm">{config.site.name}</span>
      </Link>
    </Stack>
  );
};
