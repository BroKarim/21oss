import { Listing } from "@/components/web/ui/listing";
import { ShowcaseList } from "@/components/web/showcase/showcase-list";
import { findFeaturedShowcase } from "@/server/web/showcase/queries";
import type { ContentOne } from "@/server/web/showcase/payload";

export const RelatedTools = async ({ showcase }: { showcase: ContentOne }) => {
  const showcases = await findFeaturedShowcase({ id: showcase.id });

  if (!showcases.length) {
    return null;
  }

  return (
    <Listing title={`Open source alternatives similar to ${showcase.name}:`}>
      <ShowcaseList showcases={showcases}  />
    </Listing>
  );
};