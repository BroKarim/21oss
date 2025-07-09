import type { ComponentProps, ReactNode } from "react";
import { H4 } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";

type ListingProps = ComponentProps<typeof Stack> & {
  title?: string;
  button?: ReactNode;
  separated?: boolean;
};

export const Listing = ({ children, className, title, button, separated, ...props }: ListingProps) => {
  return (
    <>
      {separated && <hr />}

      <Stack size="lg" direction="column" className={cn("items-stretch", className)} {...props}>
        <Stack className="w-full justify-between">
          {title && <H4 as="h3">{title}</H4>}

          {button && (
            <Button variant="secondary" className="-my-1" asChild>
              {button}
            </Button>
          )}
        </Stack>

        {children}
      </Stack>
    </>
  );
};
