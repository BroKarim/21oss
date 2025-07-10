import type { ComponentProps } from "react";
import { cx } from "@/lib/utils";

export const RowCheckbox = ({ className, ...props }: ComponentProps<"input">) => {
  return <input type="checkbox" className={cx("block relative z-10", className)} {...props} />;
};
