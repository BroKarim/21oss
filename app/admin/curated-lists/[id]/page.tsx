import { notFound } from "next/navigation";
import { CuratedListForm } from "@/app/admin/curated-lists/_components/curated-list-form";
import { Wrapper } from "@/components/admin/wrapper";
import { findCuratedListById } from "@/server/admin/curated-list/queries";
import { findToolList } from "@/server/admin/tools/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

const UpdateCuratedListPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const curatedList = await findCuratedListById(id);

  if (!curatedList) {
    return notFound();
  }

  return (
    <Wrapper size="md">
      <CuratedListForm title="Update curated list" curatedList={curatedList} toolsPromise={findToolList()} />
    </Wrapper>
  );
};

export default UpdateCuratedListPage;
