import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-full transition-[background-color,box-shadow] backdrop-blur-sm duration-200 ease-out bg-primary/20 shadow-sm ring-1 ring-transparent focus-visible:bg-primary/20 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black/10 disabled:cursor-not-allowed died:opacity-50 md:text-base text-white border-2 border-white/50 h-11 !text-base placeholder:text-white/80 focus:outline-none px-4"
);

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
