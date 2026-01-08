"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";
import { ToolType } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  type: string;
};

export function PlatformAutoClear({ children, type }: Props) {
  const [platform, setPlatform] = useQueryState("platform", { shallow: false });

  useEffect(() => {
    if (type !== ToolType.Template && platform) {
      setPlatform(null);
    }
  }, [type, platform, setPlatform]);

  return <>{children}</>;
}
