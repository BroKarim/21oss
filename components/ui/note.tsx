import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

type NoteProps = ComponentProps<"p"> & {
  as?: ElementType;
};

export const Note = ({ className, as, ...props }: NoteProps) => {
  const Comp = as || "p";

  return <Comp className={cn("text-sm text-muted-foreground", className)} {...props} />;
};
