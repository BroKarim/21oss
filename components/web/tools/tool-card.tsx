"use client";

import type { ComponentProps } from "react";
import { ResourceCard, ResourceCardSkeleton, type ResourceTool } from "./resources/resources-card";

type ToolCardProps = ComponentProps<typeof ResourceCard> & {
  tool: ResourceTool;
};

const ToolCard = ({ tool, ...props }: ToolCardProps) => {
  return <ResourceCard tool={tool} {...props} />;
};

const ToolCardSkeleton = () => {
  return <ResourceCardSkeleton />;
};

export { ToolCard, ToolCardSkeleton };
