import { ToolForm } from "@/app/admin/tools/_components/tool-form";
// import { withAdminPage } from "@/components/admin/auth-hoc";
import { Wrapper } from "@/components/admin/wrapper";
import { findCategoryList } from "@/server/admin/categories/queries";
import { findPlatformList } from "@/server/admin/platforms/queries";
const CreateToolPage = () => {
  return (
    <Wrapper size="md">
      <ToolForm title="Create tool" categoriesPromise={findCategoryList()} platformsPromise={findPlatformList()} />
    </Wrapper>
  );
};

export default CreateToolPage;
// export default withAdminPage(CreateToolPage);
