import { Listing } from "@/components/web/ui/listing";
import { findFeaturedTool } from "@/server/web/tools/queries";
import { ToolOne } from "@/server/web/tools/payloads";
import { ToolGalleryGroup } from "@/components/web/tools/groups/tool-gallery-groups";
export const RelatedTools = async ({ tool }: { tool: ToolOne }) => {
  const tools = await findFeaturedTool({
    orderBy: { name: "asc" },
  });

  if (!tools.length) {
    return null;
  }

  return (
    <Listing>
      <ToolGalleryGroup
        id="related-tools"
        className="border-none p-0"
        label={`Open source alternatives similar to ${tool.name}:`}
        tools={tools}
        options={{
          showViewAll: false,
          loadMore: true,
        }}
      />
    </Listing>
  );
};
