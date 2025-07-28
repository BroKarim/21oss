//AlternativePreview

import Link from "next/link";
import { ToolList, ToolListSkeleton } from "./tool-list";
import { Listing } from "../ui/listing";
import { findFeaturedTool } from "@/server/web/tools/queries";

const ToolPreview = async () => {
const tools = await findFeaturedTool({});
  // console.log("🔥 Showcase data:", tools);

  if (!tools.length) {
    return null;
  }
  return (
    <>
      <Listing title="Discover Open Source alternatives to:" button={<Link href="/alternatives">View all alternatives</Link>} separated>
        <ToolList tools={tools} />
      </Listing>
    </>
  );
};

const ToolPreviewSkeleton = () => {
  return (
    <Listing title="Discover Open Source alternatives to:">
      <ToolListSkeleton />
    </Listing>
  );
};

export { ToolPreview, ToolPreviewSkeleton };
