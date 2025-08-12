import type { ComponentProps } from "react";
import { Note } from "@/components/ui/note";
import { Stack } from "@/components/ui/stack";
import { Favicon } from "@/components/ui/favicon";
import { NavLink } from "@/components/ui/nav-link";
import { cx } from "@/lib/utils";

type BrandLinkProps = ComponentProps<"div"> & {
  href?: string;
  name: string;
  faviconUrl: string | null;
};

export const BrandLink = ({ children, className, href, name, faviconUrl, ...props }: BrandLinkProps) => {
  const Comp = href ? NavLink : "div";

  return (
    <Stack className={cx("group min-w-0 gap-[0.5em]", className)} asChild {...props}>
      <Comp href={href!}>
        <Favicon src={faviconUrl} title={name} className="size-6 p-[3px] rounded-sm" />

        <Stack size="xs" className="min-w-0 group-hover:text-foreground" asChild>
          <Note>
            <strong className="font-medium truncate">{name}</strong>
            {children && <span className="opacity-60">{children}</span>}
          </Note>
        </Stack>
      </Comp>
    </Stack>
  );
};
