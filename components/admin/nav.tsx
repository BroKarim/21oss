"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cx } from "@/lib/utils";

type NavLink = ButtonProps & {
  title: string;
  href: string;
  label?: ReactNode;
};

type NavProps = ComponentProps<"nav"> & {
  isCollapsed: boolean;
  links: (NavLink | undefined)[];
};

export const Nav = ({ className, links, isCollapsed }: NavProps) => {
  const pathname = usePathname();
  const rootPath = "/admin";

  const isActive = (href: string) => {
    if ((href === rootPath && href === pathname) || (href !== rootPath && pathname.startsWith(href))) {
      return true;
    }

    return false;
  };

  return (
    <nav className={cx("flex flex-col gap-1 p-3 group-data-[collapsed=true]/collapsible:justify-center group-data-[collapsed=true]/collapsible:px-2", className)}>
      {links.map((link, index) => {
        if (!link) {
          return <Separator key={index} className="my-2 -mx-3 w-auto" />;
        }

        const { href, title, label, suffix, ...props } = link;

        if (isCollapsed) {
          return (
            <Tooltip key={index}>
              <TooltipTrigger>
                <Button size="md" variant="ghost" aria-label={title} className={cx(isActive(href) && "bg-accent text-foreground")} asChild {...props}>
                  <Link href={href} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Stack size="lg">
                  {title}
                  {label && <span className="opacity-60">{label}</span>}
                </Stack>
              </TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Button
            key={index}
            size="md"
            variant="ghost"
            suffix={
              suffix ||
              (label && (
                <Badge variant="outline" className="ml-auto size-auto">
                  {label}
                </Badge>
              ))
            }
            className={cx("justify-start", isActive(href) && "bg-accent text-foreground")}
            asChild
            {...props}
          >
            <Link href={href}>{title}</Link>
          </Button>
        );
      })}
    </nav>
  );
};
