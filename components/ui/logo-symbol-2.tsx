import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const LogoSymbol = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 32" fill="none" className={cn("h-6 w-auto", className)} {...props}>
      <path
        fill="#000"
        d="M10.75 31.392H7.611v-3.14h3.139v3.14Zm-3.14-3.14H4.47v-3.14h3.14v3.14Zm6.279-3.14v3.14h-3.14v-3.14h3.14ZM17 22.034h-3.139v-9.418h-3.14V9.478H17v12.556Zm-7.583-4.77H3.14v1.571h6.278v3.14H0v-7.851h6.278v-1.568H0v-3.14h9.418v7.849ZM7.61 6.28H4.47V3.141h3.14v3.138Zm6.279 0h-3.14V3.141h3.14v3.138ZM10.75 3.14H7.611V0h3.139v3.14Z"
      />
    </svg>
  );
};
