import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { defineConfig } from "cva";

const customTwMerge = extendTailwindMerge({});

// Exported utility: same as your original `cn`
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

// Equivalent to `cx`
export const cx = cn;

export const { cva, compose } = defineConfig({
  hooks: {
    onComplete: (className: string) => customTwMerge(className),
  },
});

export type { VariantProps } from "cva";
