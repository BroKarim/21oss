//ToolList

import { Fragment } from "react";
import { ShowCaseCard, ShowcaseCardSkeleton } from "./showcase-card";
import type { ContentMany } from "@/server/web/showcase/payload";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ShowcaseListProps = {
  showcases: ContentMany[];
  //   adType?: AdType;
  //   enableAds?: boolean;
};

//TODO : Pending AddCard

const ShowcaseList = ({ showcases }: ShowcaseListProps) => {
  return (
    <>
      <div className="relative">
        <ScrollArea className="w-full -mx-1 px-1">
          <div className="flex space-x-4" style={{ minWidth: "100%", paddingLeft: "1px", paddingRight: "1px" }}>
            {showcases.map((showcase, order) => (
              <Fragment key={showcase.slug}>
                <div key={showcase.id} className="min-w-[280px] max-w-[280px]">
                  <ShowCaseCard showcase={showcase} style={{ order }} />
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

const ShowcaseListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="relative">
      <ScrollArea className="w-full -mx-1 px-1">
        <div className="flex space-x-4" style={{ minWidth: "100%", paddingLeft: "1px", paddingRight: "1px" }}>
          {[...Array(count)].map((_, index) => (
            <ShowcaseCardSkeleton key={index} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export { ShowcaseList, ShowcaseListSkeleton, type ShowcaseListProps };
