import type { SVGProps } from "react";
import { cx } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & {
  name: React.ReactNode;
};

export const Icon = ({ name, className, ...props }: IconProps) => {
  return (
    <svg className={cx("size-[1em]", className)} role="img" stroke="currentColor" aria-label={`${name} icon`} {...props}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
};
