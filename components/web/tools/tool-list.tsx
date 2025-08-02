import { Fragment } from "react";
import { ToolCard, ToolCardSkeleton } from "./tool-card";
import type { ToolMany } from "@/server/web/tools/payloads";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ToolListProps = {
  tools: ToolMany[];
  //   adType?: AdType;
  //   enableAds?: boolean;
};

//TODO : Pending AddCard

const ToolList = ({ tools }: ToolListProps) => {
  return (
    <>
      <div className="relative">
        <ScrollArea className="w-full -mx-1 px-1">
          <div className="flex space-x-4" style={{ minWidth: "100%", paddingLeft: "1px", paddingRight: "1px" }}>
            {tools.map((tool, order) => (
              <Fragment key={tool.slug}>
                <div key={tool.id} className="min-w-[400px] max-w-[400px]">
                  <ToolCard tool={tool} style={{ order }} />
                </div>
              </Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </>
  );
};

const ToolListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="relative">
      <ScrollArea className="w-full -mx-1 px-1">
        <div className="flex space-x-4" style={{ minWidth: "100%", paddingLeft: "1px", paddingRight: "1px" }}>
          {[...Array(count)].map((_, index) => (
            <ToolCardSkeleton key={index} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export { ToolList, ToolListSkeleton, type ToolListProps };
