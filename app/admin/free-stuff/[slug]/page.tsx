import { notFound } from "next/navigation";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";

import { findFreeStuffBySlug } from "@/server/admin/free-stuff/queries";
import { FreeStuffForm } from "@/app/admin/free-stuff/_components/free-stuff-form";
import { getAllUniqueTags } from "@/server/admin/free-stuff/queries";
type PageProps = {
  params: Promise<{ slug: string }>;
};

const UpdateFreeStuffPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const allTags = await getAllUniqueTags();
  const freeStuff = await findFreeStuffBySlug(slug);

  if (!freeStuff) {
    return notFound();
  }

  return (
    <Wrapper size="md">
      <FreeStuffForm title={`Edit ${freeStuff.name}`} freeStuff={freeStuff} allTags={allTags} />
    </Wrapper>
  );
};

export default withAdminPage(UpdateFreeStuffPage);
