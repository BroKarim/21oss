//AlternativePreview

import Link from "next/link";
import { ShowcaseList, ShowcaseListSkeleton } from "./showcase-list";
import { Listing } from "../listing";
import { findFeaturedShowcase } from "@/server/web/showcase/queries";

const ShowCasePreview = async () => {
  const showcases = await findFeaturedShowcase({});

  if (!showcases.length) {
    return null;
  }
que
    <>
      <Listing title="Discover Open Source alternatives to:" button={<Link href="/alternatives">View all alternatives</Link>} separated>
        <ShowcaseList showcases={showcases} />
      </Listing>
    </>
  );
};

const ShowCasePreviewSkeleton = () => {
  return (
    <Listing title="Discover Open Source alternatives to:">
      <ShowcaseListSkeleton />
    </Listing>
  );
};

export { ShowCasePreview, ShowCasePreviewSkeleton };
