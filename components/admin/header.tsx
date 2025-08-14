"use client";

import { usePathname } from "next/navigation";
import { type ComponentProps, useEffect, useState } from "react";

import { Stack } from "@/components/ui/stack";
import { Container } from "@/components/ui/container";
import { Hamburger } from "@/components/ui/hamburger";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/admin/user-menu";
import type { auth } from "@/lib/auth";
import { cx } from "@/lib/utils";

type HeaderProps = ComponentProps<"div"> & {
  session: typeof auth.$Infer.Session | null;
};

const Header = ({ className, session, ...props }: HeaderProps) => {
  const pathname = usePathname();
  const [isNavOpen, setNavOpen] = useState(false);

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className={cx((className = "flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between"), className)} id="header" role="banner" data-state={isNavOpen ? "open" : "close"} {...props}>
      <Container>
        <div className="flex w-full items-center gap-2">
          <Stack size="sm" wrap={false} className="mr-auto">
            <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="block -m-1 -ml-1.5 lg:hidden">
              <Hamburger className="size-7" />
            </button>

            <Logo />
          </Stack>
        </div>
      </Container>
      <UserMenu session={session} />
    </div>
  );
};

const HeaderBackdrop = () => {
  return <div className="fixed top-(--header-offset) inset-x-0 z-40 h-8 pointer-events-none bg-linear-to-b from-background to-transparent" />;
};

export { Header, HeaderBackdrop, type HeaderProps };
