"use client";

import type { HTMLAttributes } from "react";
import { TextScramble } from "@/components/ui/text-scramble";
import { cn } from "@/lib/utils";

type CornerFrameScrambleTextProps = {
  value: string | number;
  className?: string;
  as?: React.ElementType;
} & HTMLAttributes<HTMLDivElement>;

const FrameScrambleText = ({ value, className, as, ...props }: CornerFrameScrambleTextProps) => {
  return (
    <div
      className={cn(
        "relative inline-block px-6 py-3",
        "bg-[linear-gradient(to_right,white_1.5px,transparent_1.5px),linear-gradient(to_right,white_1.5px,transparent_1.5px),linear-gradient(to_left,white_1.5px,transparent_1.5px),linear-gradient(to_left,white_1.5px,transparent_1.5px),linear-gradient(to_bottom,white_1.5px,transparent_1.5px),linear-gradient(to_bottom,white_1.5px,transparent_1.5px),linear-gradient(to_top,white_1.5px,transparent_1.5px),linear-gradient(to_top,white_1.5px,transparent_1.5px)]",
        "bg-[length:15px_15px] bg-no-repeat",
        "bg-[position:0_0,0_100%,100%_0,100%_100%,0_0,100%_0,0_100%,100%_100%]",
        className
      )}
      {...props}
    >
      <TextScramble as={as} className="relative z-10">
        {value as string}
      </TextScramble>
    </div>
  );
};

export default FrameScrambleText;
