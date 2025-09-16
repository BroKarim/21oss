import { CuratedListForm } from "@/app/admin/curated-lists/_components/curated-list-form";
import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { findToolList } from "@/server/admin/tools/queries";

const CreateCuratedListPage = () => {
  return (
    <Wrapper size="md">
      <CuratedListForm title="Create curated list" toolsPromise={findToolList()} />
    </Wrapper>
  );
};

export default withAdminPage(CreateCuratedListPage);
