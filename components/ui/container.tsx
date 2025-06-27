import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn, VariantProps, cva } from "@/lib/utils";

const containerVariants = cva({
  base: "relative w-full max-w-272 mx-auto px-6 lg:px-8",
});

type ContainerProps = ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & {
    asChild?: boolean;
  };

const Container = ({ className, asChild, ...props }: ContainerProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return <Comp className={cn(containerVariants({ className }))} {...props} />;
};

export { Container, containerVariants };
