import { Listing } from "@/components/web/ui/listing";
import { ToolList } from "@/components/web/tools/tool-list";
import { findFeaturedTool } from "@/server/web/tools/queries";
import { ToolOne } from "@/server/web/tools/payloads";

export const RelatedTools = async ({ tool }: { tool: ToolOne }) => {
  const tools = await findFeaturedTool({});

  if (!tools.length) {
    return null;
  }

  return (
    <Listing title={`Open source alternatives similar to ${tool.name}:`}>
      <ToolList tools={tools} />
    </Listing>
  );
};
