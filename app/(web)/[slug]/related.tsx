import { Listing } from "@/components/web/ui/listing";
import { ShowcaseList } from "@/components/web/tool/tool-list";
import { findFeaturedShowcase } from "@/server/web/tools/queries";
import type { ContentOne } from "@/server/web/tools/payload";

export const RelatedTools = async ({ showcase }: { showcase: ContentOne }) => {
  const showcases = await findFeaturedShowcase({ id: showcase.id });

  if (!showcases.length) {
    return null;
  }

  return (
    <Listing title={`Open source alternatives similar to ${showcase.name}:`}>
      <ShowcaseList showcases={showcases} />
    </Listing>
  );
};
